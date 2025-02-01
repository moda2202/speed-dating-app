import React, { useState } from 'react';
import { ArrowRight, Shuffle, UserPlus, X, ArrowLeft } from 'lucide-react';
import { Event, Match, Participant } from '../types';

interface MatchingViewProps {
  event: Event;
  onUpdateMatches: (matches: Match[]) => void;
  onBack: () => void;
}

export const MatchingView: React.FC<MatchingViewProps> = ({
  event,
  onUpdateMatches,
  onBack,
}) => {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [manualMatches, setManualMatches] = useState<Match[]>([]);
  const [showUnmatched, setShowUnmatched] = useState(true);

  const males = event.participants.filter((p) => p.gender === 'male');
  const females = event.participants.filter((p) => p.gender === 'female');

  const generateMatches = () => {
    // Simple round-robin matching algorithm
    const newMatches: Match[] = [];
    const round = event.currentRound;
    const timestamp = Date.now();
    
    males.forEach((male, index) => {
      const femaleIndex = (index + round - 1) % females.length;
      newMatches.push({
        id: `match-${round}-${index}-${timestamp}`,
        round,
        participant1Id: male.id,
        participant2Id: females[femaleIndex].id,
      });
    });
    
    onUpdateMatches(newMatches);
  };

  const createMatch = (participant1: Participant, participant2: Participant) => {
    const timestamp = Date.now();
    const newMatch: Match = {
      id: `match-${event.currentRound}-manual-${timestamp}`,
      round: event.currentRound,
      participant1Id: participant1.id,
      participant2Id: participant2.id,
    };
    
    setManualMatches([...manualMatches, newMatch]);
  };

  const removeMatch = (matchId: string) => {
    setManualMatches(manualMatches.filter(m => m.id !== matchId));
  };

  const saveMatches = () => {
    onUpdateMatches(manualMatches);
    setManualMatches([]);
  };

  const getParticipantById = (id: string): Participant | undefined => {
    return event.participants.find((p) => p.id === id);
  };

  const isParticipantMatched = (participantId: string): boolean => {
    return manualMatches.some(
      m => m.participant1Id === participantId || m.participant2Id === participantId
    );
  };

  const getUnmatchedParticipants = (gender: 'male' | 'female'): Participant[] => {
    return event.participants.filter(
      p => p.gender === gender && !isParticipantMatched(p.id)
    );
  };

  const handleParticipantClick = (participant: Participant) => {
    if (selectedParticipant) {
      if (selectedParticipant.gender !== participant.gender) {
        createMatch(selectedParticipant, participant);
        setSelectedParticipant(null);
      }
    } else {
      setSelectedParticipant(participant);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Event
          </button>
          <h2 className="text-2xl font-bold">Round {event.currentRound} Matching</h2>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowUnmatched(!showUnmatched)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            {showUnmatched ? 'Hide' : 'Show'} Unmatched
          </button>
          <button
            onClick={generateMatches}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Shuffle className="w-5 h-5" />
            Auto Generate
          </button>
        </div>
      </div>

      {/* Manual Matching Interface */}
      {showUnmatched && (
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Unmatched Males</h3>
            <div className="space-y-4">
              {getUnmatchedParticipants('male').map((male) => (
                <div
                  key={male.id}
                  onClick={() => handleParticipantClick(male)}
                  className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-colors ${
                    selectedParticipant?.id === male.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={male.profileImage}
                    alt={male.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{male.name}</h4>
                    <p className="text-sm text-gray-600">{male.age} years</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Unmatched Females</h3>
            <div className="space-y-4">
              {getUnmatchedParticipants('female').map((female) => (
                <div
                  key={female.id}
                  onClick={() => handleParticipantClick(female)}
                  className={`flex items-center gap-4 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-colors ${
                    selectedParticipant?.id === female.id
                      ? 'ring-2 ring-blue-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={female.profileImage}
                    alt={female.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{female.name}</h4>
                    <p className="text-sm text-gray-600">{female.age} years</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current Matches */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Current Matches</h3>
          {manualMatches.length > 0 && (
            <button
              onClick={saveMatches}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Save Matches
            </button>
          )}
        </div>

        <div className="space-y-4">
          {manualMatches.map((match) => {
            const participant1 = getParticipantById(match.participant1Id);
            const participant2 = getParticipantById(match.participant2Id);

            return (
              <div
                key={match.id}
                className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={participant1?.profileImage}
                    alt={participant1?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{participant1?.name}</h4>
                    <p className="text-sm text-gray-600">{participant1?.age} years</p>
                  </div>
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400" />

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <h4 className="font-semibold">{participant2?.name}</h4>
                    <p className="text-sm text-gray-600">{participant2?.age} years</p>
                  </div>
                  <img
                    src={participant2?.profileImage}
                    alt={participant2?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>

                <button
                  onClick={() => removeMatch(match.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};