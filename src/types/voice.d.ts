declare module 'react-native-voice' {
  export interface SpeechRecognition {
    onSpeechStart?: (e: any) => void;
    onSpeechRecognized?: (e: any) => void;
    onSpeechEnd?: (e: any) => void;
    onSpeechError?: (e: any) => void;
    onSpeechResults?: (e: any) => void;
    onSpeechPartialResults?: (e: any) => void;
    onSpeechVolumeChanged?: (e: any) => void;
  }

  const Voice: {
    onSpeechStart: ((e: any) => void) | undefined;
    onSpeechRecognized: ((e: any) => void) | undefined;
    onSpeechEnd: ((e: any) => void) | undefined;
    onSpeechError: ((e: any) => void) | undefined;
    onSpeechResults: ((e: any) => void) | undefined;
    onSpeechPartialResults: ((e: any) => void) | undefined;
    onSpeechVolumeChanged: ((e: any) => void) | undefined;
    start: (language?: string, options?: any) => Promise<void>;
    stop: () => Promise<void>;
    cancel: () => Promise<void>;
    destroy: () => Promise<void>;
    removeAllListeners: () => void;
    isAvailable: () => Promise<boolean>;
    getSpeechRecognitionServices: () => Promise<string[]>;
  };

  export default Voice;
}

declare module 'react-native-tts' {
  const Tts: {
    speak: (text: string) => Promise<void>;
    stop: () => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    setDefaultLanguage: (language: string) => void;
    setDefaultVoice: (voice: string) => void;
    setDefaultRate: (rate: number) => void;
    setDefaultPitch: (pitch: number) => void;
    voices: () => Promise<any[]>;
    engines: () => Promise<any[]>;
    addEventListener: (type: string, handler: (event: any) => void) => void;
    removeEventListener: (type: string, handler: (event: any) => void) => void;
    removeAllListeners: (type: string) => void;
    requestInstallEngine: () => void;
    requestInstallData: () => void;
    setIgnoreSilentSwitch: (ignore: boolean) => void;
    setDefaultEngine: (engineName: string) => void;
    getInitStatus: () => Promise<string>;
  };

  export default Tts;
}
