import React, { useState } from 'react';
import { Event, Participant } from './types';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { ParticipantDashboard } from './components/ParticipantDashboard';
import { CreateEventForm } from './components/CreateEventForm';
import { UserCircle2 } from 'lucide-react';
import { ProfileSettings } from './components/ProfileSettings';

// Sample organizer profile
const organizerProfile: Participant = {
  id: 'organizer-1',
  name: 'Event Organizer',
  age: 30,
  gender: 'male',
  occupation: 'Event Manager',
  interests: ['Event Planning', 'Networking', 'Community Building'],
  bio: 'Professional event organizer with experience in creating meaningful connections.',
  profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
  contactDetails: {
    email: 'organizer@events.com',
    phone: '+1234567890',
  },
};

// Sample participants data
const sampleParticipants: Participant[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 28,
    gender: 'male',
    occupation: 'Software Engineer',
    interests: ['Technology', 'Travel', 'Music'],
    bio: 'Passionate about coding and exploring new places.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    contactDetails: { email: 'john@example.com', phone: '+1234567890' },
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 26,
    gender: 'female',
    occupation: 'Marketing Manager',
    interests: ['Art', 'Photography', 'Hiking'],
    bio: 'Creative soul with a love for outdoor adventures.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    contactDetails: { email: 'jane@example.com', phone: '+1234567891' },
  },
  {
    id: '3',
    name: 'Michael Johnson',
    age: 30,
    gender: 'male',
    occupation: 'Financial Analyst',
    interests: ['Finance', 'Sports', 'Reading'],
    bio: 'Numbers enthusiast who enjoys staying active.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    contactDetails: { email: 'michael@example.com', phone: '+1234567892' },
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 25,
    gender: 'female',
    occupation: 'Graphic Designer',
    interests: ['Design', 'Travel', 'Photography'],
    bio: 'Visual storyteller with a passion for creativity.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    contactDetails: { email: 'emily@example.com', phone: '+1234567893' },
  },
  {
    id: '5',
    name: 'David Wilson',
    age: 32,
    gender: 'male',
    occupation: 'Doctor',
    interests: ['Healthcare', 'Fitness', 'Cooking'],
    bio: 'Healthcare professional who loves helping others.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    contactDetails: { email: 'david@example.com', phone: '+1234567894' },
  },
  {
    id: '6',
    name: 'Sarah Brown',
    age: 27,
    gender: 'female',
    occupation: 'Teacher',
    interests: ['Education', 'Reading', 'Travel'],
    bio: 'Passionate educator with a love for learning.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    contactDetails: { email: 'sarah@example.com', phone: '+1234567895' },
  },
  {
    id: '7',
    name: 'James Taylor',
    age: 29,
    gender: 'male',
    occupation: 'Architect',
    interests: ['Architecture', 'Art', 'Design'],
    bio: 'Creating spaces that inspire and delight.',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    contactDetails: { email: 'james@example.com', phone: '+1234567896' },
  },
  {
    id: '8',
    name: 'Emma Wilson',
    age: 24,
    gender: 'female',
    occupation: 'Journalist',
    interests: ['Writing', 'Current Events', 'Travel'],
    bio: 'Storyteller with a passion for truth.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
    contactDetails: { email: 'emma@example.com', phone: '+1234567897' },
  },
  {
    id: '9',
    name: 'Robert Martinez',
    age: 31,
    gender: 'male',
    occupation: 'Chef',
    interests: ['Cooking', 'Food', 'Travel'],
    bio: 'Culinary artist with a taste for adventure.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    contactDetails: { email: 'robert@example.com', phone: '+1234567898' },
  },
  {
    id: '10',
    name: 'Olivia Lee',
    age: 28,
    gender: 'female',
    occupation: 'UX Designer',
    interests: ['Design', 'Technology', 'Art'],
    bio: 'Creating user-friendly digital experiences.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
    contactDetails: { email: 'olivia@example.com', phone: '+1234567899' },
  },
  {
    id: '11',
    name: 'William Anderson',
    age: 33,
    gender: 'male',
    occupation: 'Business Consultant',
    interests: ['Business', 'Technology', 'Travel'],
    bio: 'Strategic thinker with global perspective.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    contactDetails: { email: 'william@example.com', phone: '+1234567900' },
  },
  {
    id: '12',
    name: 'Sophia Garcia',
    age: 26,
    gender: 'female',
    occupation: 'Psychologist',
    interests: ['Psychology', 'Art', 'Reading'],
    bio: 'Helping others understand themselves better.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    contactDetails: { email: 'sophia@example.com', phone: '+1234567901' },
  },
  {
    id: '13',
    name: 'Daniel Thompson',
    age: 30,
    gender: 'male',
    occupation: 'Product Manager',
    interests: ['Technology', 'Innovation', 'Sports'],
    bio: 'Building products that make a difference.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    contactDetails: { email: 'daniel@example.com', phone: '+1234567902' },
  },
  {
    id: '14',
    name: 'Isabella Rodriguez',
    age: 27,
    gender: 'female',
    occupation: 'Interior Designer',
    interests: ['Design', 'Art', 'Travel'],
    bio: 'Creating beautiful spaces for living.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    contactDetails: { email: 'isabella@example.com', phone: '+1234567903' },
  },
  {
    id: '15',
    name: 'Christopher Lee',
    age: 34,
    gender: 'male',
    occupation: 'Marketing Director',
    interests: ['Marketing', 'Technology', 'Music'],
    bio: 'Digital marketing expert with creative flair.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    contactDetails: { email: 'chris@example.com', phone: '+1234567904' },
  },
  {
    id: '16',
    name: 'Mia White',
    age: 25,
    gender: 'female',
    occupation: 'Data Scientist',
    interests: ['Technology', 'Mathematics', 'Art'],
    bio: 'Finding patterns in the chaos of data.',
    profileImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
    contactDetails: { email: 'mia@example.com', phone: '+1234567905' },
  },
  {
    id: '17',
    name: 'Andrew Clark',
    age: 31,
    gender: 'male',
    occupation: 'Environmental Scientist',
    interests: ['Environment', 'Science', 'Hiking'],
    bio: 'Working towards a sustainable future.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    contactDetails: { email: 'andrew@example.com', phone: '+1234567906' },
  },
  {
    id: '18',
    name: 'Victoria Kim',
    age: 28,
    gender: 'female',
    occupation: 'Event Planner',
    interests: ['Events', 'Art', 'Travel'],
    bio: 'Creating memorable experiences.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    contactDetails: { email: 'victoria@example.com', phone: '+1234567907' },
  },
  {
    id: '19',
    name: 'Thomas Moore',
    age: 29,
    gender: 'male',
    occupation: 'Software Developer',
    interests: ['Technology', 'Gaming', 'Music'],
    bio: 'Coding the future, one line at a time.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    contactDetails: { email: 'thomas@example.com', phone: '+1234567908' },
  },
  {
    id: '20',
    name: 'Ava Martinez',
    age: 26,
    gender: 'female',
    occupation: 'Content Creator',
    interests: ['Media', 'Writing', 'Photography'],
    bio: 'Telling stories through digital media.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    contactDetails: { email: 'ava@example.com', phone: '+1234567909' },
  },
];

function App() {
  const [event, setEvent] = useState<Event | null>(null);
  const [userType, setUserType] = useState<'organizer' | 'participant'>('organizer');
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(
    sampleParticipants[0]
  );
  const [organizerData, setOrganizerData] = useState<Participant>(organizerProfile);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleCreateEvent = (newEvent: Event) => {
    setEvent({
      ...newEvent,
      participants: sampleParticipants,
      matches: [],
      roundFeedback: [],
    });
  };

  const handleUpdateMatch = (matchId: string, updates: Partial<Match>) => {
    if (!event) return;
    
    setEvent((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        matches: prev.matches.map((m) =>
          m.id === matchId ? { ...m, ...updates } : m
        ),
      };
    });
  };

  const handleUpdateProfile = (updatedProfile: Participant) => {
    if (userType === 'organizer') {
      setOrganizerData(updatedProfile);
    } else {
      setCurrentParticipant(updatedProfile);
      if (event) {
        setEvent({
          ...event,
          participants: event.participants.map((p) =>
            p.id === updatedProfile.id ? updatedProfile : p
          ),
        });
      }
    }
  };

  const currentProfile = userType === 'organizer' ? organizerData : currentParticipant;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* View Toggle Bar */}
      <div className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-12">
            <div className="flex space-x-1">
              <button
                onClick={() => setUserType('organizer')}
                className={`px-4 h-full flex items-center transition-colors ${
                  userType === 'organizer'
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Organizer View
              </button>
              <button
                onClick={() => setUserType('participant')}
                className={`px-4 h-full flex items-center transition-colors ${
                  userType === 'participant'
                    ? 'bg-blue-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                Participant View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Speed Dating App</h1>
            </div>
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
                >
                  {currentProfile ? (
                    <img
                      src={currentProfile.profileImage}
                      alt={currentProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle2 className="w-8 h-8 text-gray-600" />
                  )}
                </button>
                {showProfileMenu && currentProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                    <div className="px-4 py-2 border-b">
                      <p className="font-semibold">{currentProfile.name}</p>
                      <p className="text-sm text-gray-600">{currentProfile.contactDetails.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileSettings(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        // Handle sign out
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showProfileSettings && currentProfile && (
        <ProfileSettings
          participant={currentProfile}
          onClose={() => setShowProfileSettings(false)}
          onUpdate={handleUpdateProfile}
        />
      )}

      {userType === 'organizer' ? (
        event ? (
          <OrganizerDashboard event={event} onUpdateEvent={setEvent} />
        ) : (
          <CreateEventForm onCreateEvent={handleCreateEvent} />
        )
      ) : (
        currentParticipant && event && (
          <ParticipantDashboard
            event={event}
            currentParticipant={currentParticipant}
            onUpdateMatch={handleUpdateMatch}
          />
        )
      )}
    </div>
  );
}

export default App;