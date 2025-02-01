export interface Participant {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  occupation: string;
  interests: string[];
  bio: string;
  profileImage: string;
  contactDetails: {
    email: string;
    phone: string;
  };
  preferences?: {
    ageRange: { min: number; max: number };
    interests: string[];
    lookingFor: string[];
  };
}

export interface PostRoundFeedback {
  matchId: string;
  participantId: string;
  chemistry: number; // 1-5
  commonInterests: number; // 1-5
  conversation: number; // 1-5
  wouldMeetAgain: boolean;
  notes?: string;
}

export interface Match {
  id: string;
  round: number;
  participant1Id: string;
  participant2Id: string;
  participant1Rating?: number;
  participant2Rating?: number;
  participant1Notes?: string;
  participant2Notes?: string;
  participant1WantsToShare?: boolean;
  participant2WantsToShare?: boolean;
  participant1Feedback?: PostRoundFeedback;
  participant2Feedback?: PostRoundFeedback;
  chatEnabled?: boolean;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  currentRound: number;
  maxParticipants: number;
  roundDurationMinutes: number;
  status: 'pending' | 'in-progress' | 'completed';
  participants: Participant[];
  matches: Match[];
  roundFeedback: PostRoundFeedback[];
}