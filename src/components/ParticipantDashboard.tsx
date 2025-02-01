import React, { useState, useEffect } from 'react';
import { Event, Participant, Match } from '../types';
import { ParticipantCard } from './ParticipantCard';
import { PostRoundSurvey } from './PostRoundSurvey';
import { Clock } from 'lucide-react';

interface ParticipantDashboardProps {
  event: Event;
  currentParticipant: Participant;
  onUpdateMatch: (matchId: string, updates: Partial<Match>) => void;
}

export const ParticipantDashboard: React.FC<ParticipantDashboardProps> = ({
  event,
  currentParticipant,
  onUpdateMatch,
}) => {
  const [showSurvey, setShowSurvey] = useState(false);

  const getCurrentMatch = () => {
    return event.matches.find(
      (m) =>
        m.round === event.currentRound &&
        (m.participant1Id === currentParticipant.id ||
          m.participant2Id === currentParticipant.id)
    );
  };

  const getMatchedParticipant = (match: Match) => {
    const matchedId =
      match.participant1Id === currentParticipant.id
        ? match.participant2Id
        : match.participant1Id;
    return event.participants.find((p) => p.id === matchedId);
  };

  const handleSubmitFeedback = (feedback: any) => {
    const currentMatch = getCurrentMatch();
    if (!currentMatch) return;

    const isParticipant1 = currentMatch.participant1Id === currentParticipant.id;
    onUpdateMatch(currentMatch.id, {
      ...(isParticipant1
        ? { participant1Feedback: feedback }
        : { participant2Feedback: feedback }),
    });
    setShowSurvey(false);
  };

  const currentMatch = getCurrentMatch();
  const matchedParticipant = currentMatch ? getMatchedParticipant(currentMatch) : null;

  // Check if feedback is needed
  const needsFeedback = currentMatch && (
    (currentMatch.participant1Id === currentParticipant.id && !currentMatch.participant1Feedback) ||
    (currentMatch.participant2Id === currentParticipant.id && !currentMatch.participant2Feedback)
  ) && (event.status === 'round-ended' || currentMatch.roundEnded);

  // Show survey when round is completed and feedback is needed
  useEffect(() => {
    if (needsFeedback && !showSurvey) {
      setShowSurvey(true);
    }
  }, [needsFeedback, event.status, currentMatch?.roundEnded]);

  // Check if event is completed (all rounds done)
  const isEventCompleted = event.currentRound === 3 && event.status === 'round-ended';

  // Get previous matches (excluding current match)
  const getPreviousMatches = () => {
    return event.matches.filter(
      (m) =>
        (m.participant1Id === currentParticipant.id ||
          m.participant2Id === currentParticipant.id) &&
        m.round < event.currentRound
    );
  };

  if (showSurvey && currentMatch && matchedParticipant) {
    return (
      <PostRoundSurvey
        match={currentMatch}
        currentParticipant={currentParticipant}
        matchedParticipant={matchedParticipant}
        onSubmit={handleSubmitFeedback}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Speed Dating Event</h1>
        <p className="text-gray-600">
          {isEventCompleted ? 'Event Completed' : `Round ${event.currentRound} of 3`}
        </p>
      </div>

      {needsFeedback ? (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-6">Round {event.currentRound} Complete!</h2>
          <p className="text-gray-600 mb-8">Please take a moment to provide feedback about your speed date.</p>
          <button
            onClick={() => setShowSurvey(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Survey
          </button>
        </div>
      ) : matchedParticipant && !isEventCompleted ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Current Match</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" />
              <span>Round {event.currentRound}</span>
            </div>
          </div>
          <ParticipantCard
            participant={matchedParticipant}
            onRate={(rating) =>
              currentMatch &&
              onUpdateMatch(currentMatch.id, {
                ...(currentMatch.participant1Id === currentParticipant.id
                  ? { participant1Rating: rating }
                  : { participant2Rating: rating }),
              })
            }
            showShareOption={false}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">
            {isEventCompleted ? 'Event Completed!' : 'Waiting for next match...'}
          </h2>
          <p className="text-gray-600">
            {isEventCompleted
              ? 'You can now review all your matches and share contact information with those you liked.'
              : 'The organizer will assign your next match soon.'}
          </p>
        </div>
      )}

      {/* Previous Matches Section */}
      {getPreviousMatches().length > 0 && !isEventCompleted && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Previous Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPreviousMatches().map((match) => {
              const participant = getMatchedParticipant(match);
              if (!participant) return null;

              const isMatch =
                match.participant1WantsToShare && match.participant2WantsToShare;

              const hasShared = match.participant1Id === currentParticipant.id
                ? match.participant1WantsToShare
                : match.participant2WantsToShare;

              return (
                <ParticipantCard
                  key={match.id}
                  participant={participant}
                  isMatch={isMatch}
                  showShareOption={isEventCompleted}
                  hasShared={hasShared}
                  onShare={(share) =>
                    onUpdateMatch(match.id, {
                      ...(match.participant1Id === currentParticipant.id
                        ? { participant1WantsToShare: share }
                        : { participant2WantsToShare: share }),
                    })
                  }
                />
              );
            })}
          </div>
        </div>
      )}

      {/* All Matches Section (shown only when event is completed) */}
      {isEventCompleted && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">All Your Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {event.matches
              .filter(
                (m) =>
                  m.participant1Id === currentParticipant.id ||
                  m.participant2Id === currentParticipant.id
              )
              .map((match) => {
                const participant = getMatchedParticipant(match);
                if (!participant) return null;

                const isMatch =
                  match.participant1WantsToShare && match.participant2WantsToShare;

                const hasShared = match.participant1Id === currentParticipant.id
                  ? match.participant1WantsToShare
                  : match.participant2WantsToShare;

                return (
                  <ParticipantCard
                    key={match.id}
                    participant={participant}
                    isMatch={isMatch}
                    showShareOption={true}
                    hasShared={hasShared}
                    onShare={(share) =>
                      onUpdateMatch(match.id, {
                        ...(match.participant1Id === currentParticipant.id
                          ? { participant1WantsToShare: share }
                          : { participant2WantsToShare: share }),
                      })
                    }
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};