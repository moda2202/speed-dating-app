import React, { useState, useEffect } from 'react';
import { Users, Clock, Heart, ChevronRight, Play, Square, AlertCircle, History, MessageCircle } from 'lucide-react';
import { Event, Match } from '../types';
import { MatchingView } from './MatchingView';

interface OrganizerDashboardProps {
  event: Event;
  onUpdateEvent: (event: Event) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  event,
  onUpdateEvent,
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'matching'>('overview');
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [roundTimer, setRoundTimer] = useState<number | null>(null);
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedRound, setSelectedRound] = useState<number>(event.currentRound);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const startRound = () => {
    setRoundInProgress(true);
    setRoundCompleted(false);
    const duration = event.roundDurationMinutes * 60; // Convert to seconds
    setRoundTimer(duration);

    // Start countdown
    const timer = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          endRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(timer);

    onUpdateEvent({
      ...event,
      status: 'in-progress',
    });
  };

  const endRound = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    setRoundInProgress(false);
    setRoundTimer(null);
    setRoundCompleted(true);

    // Use a timeout to avoid state updates during render
    setTimeout(() => {
      onUpdateEvent({
        ...event,
        status: 'round-ended',
        matches: event.matches.map(match => {
          if (match.round === event.currentRound) {
            return {
              ...match,
              roundEnded: true
            };
          }
          return match;
        })
      });
    }, 0);
  };

  const startNextRound = () => {
    const nextRound = Math.min(3, event.currentRound + 1);
    setRoundCompleted(false);
    onUpdateEvent({
      ...event,
      currentRound: nextRound,
      status: 'pending',
    });
    setSelectedRound(nextRound);
  };

  const getMatchStats = () => {
    const currentMatches = event.matches.filter(
      (m) => m.round === event.currentRound
    );
    const completed = currentMatches.filter(
      (m) => m.participant1Feedback && m.participant2Feedback
    ).length;
    return {
      total: currentMatches.length,
      completed,
      pending: currentMatches.length - completed,
    };
  };

  const getMutualMatches = () => {
    return event.matches.filter(
      (m) => m.participant1WantsToShare && m.participant2WantsToShare
    ).length;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasCurrentRoundMatches = event.matches.some(
    (m) => m.round === event.currentRound
  );

  if (activeView === 'matching') {
    return (
      <MatchingView
        event={event}
        onUpdateMatches={(matches) =>
          onUpdateEvent({ ...event, matches: [...event.matches, ...matches] })
        }
        onBack={() => setActiveView('overview')}
      />
    );
  }

  const stats = getMatchStats();
  const canStartRound = hasCurrentRoundMatches && !roundInProgress && !roundCompleted;
  const canStartNextRound = roundCompleted && event.currentRound < 3;
  const isEventCompleted = event.currentRound === 3 && event.status === 'round-ended';

  // Get matches where participants have shared contacts
  const getSharedContactMatches = () => {
    return event.matches.filter(
      (m) => m.participant1WantsToShare && m.participant2WantsToShare
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
        <p className="text-gray-600">
          {new Date(event.date).toLocaleDateString()}
        </p>
      </div>

      {/* Round Timer */}
      {roundInProgress && roundTimer !== null && (
        <div className="mb-8 bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-blue-900">Round {event.currentRound} in Progress</h2>
              <p className="text-blue-700 text-3xl font-bold mt-2">{formatTime(roundTimer)}</p>
            </div>
            <button
              onClick={endRound}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Square className="w-5 h-5" />
              End Round
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Participants</h3>
              <p className="text-3xl font-bold">{event.participants.length}</p>
            </div>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Males: {event.participants.filter((p) => p.gender === 'male').length}</span>
            <span>Females: {event.participants.filter((p) => p.gender === 'female').length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Clock className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Current Round</h3>
              <p className="text-3xl font-bold">{event.currentRound}/3</p>
            </div>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Completed: {stats.completed}</span>
            <span>Pending: {stats.pending}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="w-8 h-8 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold">Mutual Matches</h3>
              <p className="text-3xl font-bold">{getMutualMatches()}</p>
            </div>
          </div>
        </div>
      </div>

      {!hasCurrentRoundMatches && !roundInProgress && (
        <div className="mb-8 bg-yellow-50 p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">
            You need to create matches for Round {event.currentRound} before starting the round.
          </p>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {!roundInProgress && (
          <>
            <button
              onClick={() => setActiveView('matching')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Matches
              <ChevronRight className="w-5 h-5" />
            </button>
            {canStartRound && (
              <button
                onClick={startRound}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-5 h-5" />
                Start Round {event.currentRound}
              </button>
            )}
            {canStartNextRound && (
              <button
                onClick={startNextRound}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Next Round
              </button>
            )}
          </>
        )}
      </div>

      {/* Shared Contacts Section */}
      {isEventCompleted && getSharedContactMatches().length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold">Shared Contacts</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {getSharedContactMatches().map((match) => {
                const p1 = event.participants.find((p) => p.id === match.participant1Id);
                const p2 = event.participants.find((p) => p.id === match.participant2Id);

                return (
                  <div key={match.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p1?.profileImage}
                          alt={p1?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{p1?.name}</p>
                          <p className="text-sm text-gray-600">{p1?.contactDetails.email}</p>
                          <p className="text-sm text-gray-600">{p1?.contactDetails.phone}</p>
                        </div>
                      </div>

                      <Heart className="w-5 h-5 text-red-500 fill-current" />

                      <div className="flex items-center gap-3">
                        <img
                          src={p2?.profileImage}
                          alt={p2?.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{p2?.name}</p>
                          <p className="text-sm text-gray-600">{p2?.contactDetails.email}</p>
                          <p className="text-sm text-gray-600">{p2?.contactDetails.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Match History */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <History className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-semibold">Match History</h2>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((round) => (
                <button
                  key={round}
                  onClick={() => setSelectedRound(round)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedRound === round
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Round {round}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-4">Participant 1</th>
                <th className="pb-4">Participant 2</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Feedback</th>
                <th className="pb-4">Match</th>
              </tr>
            </thead>
            <tbody>
              {event.matches
                .filter((m) => m.round === selectedRound)
                .map((match) => {
                  const p1 = event.participants.find(
                    (p) => p.id === match.participant1Id
                  );
                  const p2 = event.participants.find(
                    (p) => p.id === match.participant2Id
                  );
                  const isMatch = match.participant1WantsToShare && match.participant2WantsToShare;

                  return (
                    <tr key={match.id} className="border-t">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p1?.profileImage}
                            alt={p1?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{p1?.name}</p>
                            <p className="text-sm text-gray-600">{p1?.age} years</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p2?.profileImage}
                            alt={p2?.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{p2?.name}</p>
                            <p className="text-sm text-gray-600">{p2?.age} years</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        {match.participant1Feedback && match.participant2Feedback
                          ? 'Completed'
                          : selectedRound === event.currentRound && roundInProgress
                          ? 'In Progress'
                          : 'Pending Feedback'}
                      </td>
                      <td className="py-4">
                        {match.participant1Feedback && match.participant2Feedback ? (
                          <div className="flex items-center gap-2">
                            <span className="text-green-600">Both submitted</span>
                          </div>
                        ) : (
                          <div className="text-gray-500">
                            {match.participant1Feedback ? 'P1 submitted' : ''}
                            {match.participant2Feedback ? 'P2 submitted' : ''}
                            {!match.participant1Feedback && !match.participant2Feedback
                              ? 'Waiting'
                              : ''}
                          </div>
                        )}
                      </td>
                      <td className="py-4">
                        {isMatch ? (
                          <div className="flex items-center gap-2 text-red-600">
                            <Heart className="w-5 h-5 fill-current" />
                            <span>Match!</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">No match</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};