// Emergency category types
export interface EmergencyCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  instructions: FirstAidInstruction[];
}

// First aid instruction types
export interface FirstAidInstruction {
  id: string;
  step: number;
  title: string;
  description: string;
  audioText: string;
  duration?: number;
  isComplete?: boolean;
}

// Voice interaction types
export interface VoiceInteraction {
  id: string;
  type: 'user' | 'system';
  text: string;
  timestamp: Date;
  audioUrl?: string;
}

// Emergency call types
export interface EmergencyCall {
  id: string;
  emergencyNumber: string;
  location?: string;
  timestamp: Date;
  description?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  preferences: UserPreferences;
  emergencyHistory: EmergencySession[];
}

export interface UserPreferences {
  voiceEnabled: boolean;
  language: string;
  emergencyContact?: string;
  location?: string;
}

// Emergency session types
export interface EmergencySession {
  id: string;
  userId: string;
  categoryId: string;
  startTime: Date;
  endTime?: Date;
  interactions: VoiceInteraction[];
  instructions: FirstAidInstruction[];
  emergencyCallMade?: boolean;
  status: 'active' | 'completed' | 'emergency_called';
}

// Voice service types
export interface VoiceServiceResponse {
  success: boolean;
  text?: string;
  error?: string;
  confidence?: number;
}

export interface TTSConfig {
  language: string;
  rate: number;
  pitch: number;
  voice?: string;
}

export interface STTConfig {
  language: string;
  partialResults: boolean;
  timeout: number;
  onResults?: (results: string[]) => void;
  onError?: (error: any) => void;
  onPartialResults?: (results: string[]) => void;
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  EmergencyCategories: undefined;
  VoiceInteraction: {
    categoryId?: string;
    emergencyType?: string;
  };
  EmergencyCall: {
    emergencyNumber: string;
    description?: string;
  };
  Settings: undefined;
  History: undefined;
};

// API response types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Offline data types
export interface OfflineData {
  categories: EmergencyCategory[];
  basicInstructions: FirstAidInstruction[];
  lastUpdated: Date;
}
