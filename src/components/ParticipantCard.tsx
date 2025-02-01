import React from 'react';
import { Clock, Heart, MessageCircle, User } from 'lucide-react';
import { Participant } from '../types';

interface ParticipantCardProps {
  participant: Participant;
  isMatch?: boolean;
  onRate?: (rating: number) => void;
  onShare?: (share: boolean) => void;
  showShareOption?: boolean;
  hasShared?: boolean;
}

export const ParticipantCard: React.FC<ParticipantCardProps> = ({
  participant,
  isMatch,
  onRate,
  onShare,
  showShareOption = false,
  hasShared = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img
          src={participant.profileImage}
          alt={participant.name}
          className="w-full h-full object-cover"
        />
        {isMatch && (
          <div className="absolute top-4 right-4">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{participant.name}</h3>
          <span className="text-gray-600">{participant.age} years</span>
        </div>
        <div className="flex items-center text-gray-600 mb-4">
          <User className="w-4 h-4 mr-2" />
          <span>{participant.occupation}</span>
        </div>
        <p className="text-gray-700 mb-4">{participant.bio}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {participant.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-4">
          {onRate && (
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => onRate(rating)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      rating <= 3 ? 'text-gray-400' : 'text-red-500 fill-current'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
          {showShareOption && onShare && (
            <button
              onClick={() => onShare(!hasShared)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                hasShared
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              {hasShared ? 'Contact Shared' : 'Share Contact'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};