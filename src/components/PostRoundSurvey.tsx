import React, { useState } from 'react';
import { Heart, MessageSquare, Users } from 'lucide-react';
import { Match, Participant, PostRoundFeedback } from '../types';

interface PostRoundSurveyProps {
  match: Match;
  currentParticipant: Participant;
  matchedParticipant: Participant;
  onSubmit: (feedback: PostRoundFeedback) => void;
}

export const PostRoundSurvey: React.FC<PostRoundSurveyProps> = ({
  match,
  currentParticipant,
  matchedParticipant,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState<Partial<PostRoundFeedback>>({
    matchId: match.id,
    participantId: currentParticipant.id,
    chemistry: 3,
    commonInterests: 3,
    conversation: 3,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback as PostRoundFeedback);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Rate Your Speed Date</h2>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={matchedParticipant.profileImage}
          alt={matchedParticipant.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-lg">{matchedParticipant.name}</h3>
          <p className="text-gray-600">{matchedParticipant.occupation}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How was your chemistry?
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFeedback({ ...feedback, chemistry: rating })}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  feedback.chemistry === rating
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    feedback.chemistry === rating ? 'fill-current' : ''
                  }`}
                />
                <span className="text-sm">{rating}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            How was the conversation?
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFeedback({ ...feedback, conversation: rating })}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  feedback.conversation === rating
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare
                  className={`w-6 h-6 ${
                    feedback.conversation === rating ? 'fill-current' : ''
                  }`}
                />
                <span className="text-sm">{rating}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Did you find common interests?
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFeedback({ ...feedback, commonInterests: rating })}
                className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  feedback.commonInterests === rating
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users
                  className={`w-6 h-6 ${
                    feedback.commonInterests === rating ? 'fill-current' : ''
                  }`}
                />
                <span className="text-sm">{rating}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (optional)
          </label>
          <textarea
            value={feedback.notes}
            onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Any additional thoughts about your speed date..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};