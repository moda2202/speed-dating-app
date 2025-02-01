import React, { useState } from 'react';
import { Participant } from '../types';
import { Briefcase, Heart, Phone, Mail, X } from 'lucide-react';

interface ProfileSettingsProps {
  participant: Participant;
  onClose: () => void;
  onUpdate: (updatedParticipant: Participant) => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  participant,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    occupation: participant.occupation,
    bio: participant.bio,
    interests: participant.interests.join(', '),
    email: participant.contactDetails.email,
    phone: participant.contactDetails.phone,
    profileImage: participant.profileImage,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedParticipant: Participant = {
      ...participant,
      occupation: formData.occupation,
      bio: formData.bio,
      interests: formData.interests.split(',').map(i => i.trim()),
      contactDetails: {
        email: formData.email,
        phone: formData.phone,
      },
      profileImage: formData.profileImage,
    };

    onUpdate(updatedParticipant);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Profile Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <img
              src={formData.profileImage}
              alt={participant.name}
              className="w-24 h-24 rounded-full object-cover"
            />
            <div>
              <h3 className="text-xl font-semibold">{participant.name}</h3>
              <p className="text-gray-600">
                {participant.age} years • {participant.gender}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={formData.profileImage}
              onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Occupation
              </div>
            </label>
            <input
              type="text"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests (comma-separated)
              </div>
            </label>
            <input
              type="text"
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Travel, Music, Art"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1234567890"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};