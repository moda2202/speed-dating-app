import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Event } from '../types';

interface CreateEventFormProps {
  onCreateEvent: (event: Event) => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ onCreateEvent }) => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    roundDurationMinutes: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...eventData,
      currentRound: 1,
      maxParticipants: 20,
      status: 'pending',
      participants: [],
      matches: [],
      roundFeedback: [],
    };
    
    onCreateEvent(newEvent);
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const duration = parseInt(value);
    if (!isNaN(duration) && duration >= 3 && duration <= 10) {
      setEventData({ ...eventData, roundDurationMinutes: duration });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Speed Dating Event</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            required
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Spring Speed Dating Night"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              required
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Round Duration (minutes)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              required
              min="3"
              max="10"
              value={eventData.roundDurationMinutes}
              onChange={handleDurationChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
          <Users className="text-blue-500 w-5 h-5 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Participant Information</h3>
            <p className="text-sm text-blue-700">
              20 participants are already registered for this event (10 males and 10 females)
            </p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};