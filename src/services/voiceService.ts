import Voice from 'react-native-voice';
import Tts from 'react-native-tts';
import { VoiceServiceResponse, TTSConfig, STTConfig } from '../models/types';

class VoiceService {
  private isListening = false;
  private isSpeaking = false;
  private currentResultsCallback?: (results: string[]) => void;
  private currentErrorCallback?: (error: any) => void;
  private currentPartialResultsCallback?: (results: string[]) => void;

  constructor() {
    this.initializeVoice();
    this.initializeTTS();
  }

  // Initialize voice recognition
  private initializeVoice() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged;
  }

  // Initialize Text-to-Speech
  private initializeTTS() {
    Tts.setDefaultLanguage('es-ES'); // Spanish for Bolivia
    Tts.setDefaultRate(0.6); // Slower rate for emergency situations
    Tts.setDefaultPitch(1.0);
    
    // Set up TTS event listeners
    Tts.addEventListener('tts-start', this.onTtsStart);
    Tts.addEventListener('tts-finish', this.onTtsFinish);
    Tts.addEventListener('tts-cancel', this.onTtsCancel);
  }

  // Voice recognition event handlers
  private onSpeechStart = (_e: any) => {
    console.log('Speech recognition started');
    this.isListening = true;
  };

  private onSpeechRecognized = (_e: any) => {
    console.log('Speech recognized');
  };

  private onSpeechEnd = (_e: any) => {
    console.log('Speech recognition ended');
    this.isListening = false;
  };

  private onSpeechError = (e: any) => {
    console.error('Speech recognition error:', e.error);
    this.isListening = false;
    if (this.currentErrorCallback) {
      this.currentErrorCallback(e.error);
    }
  };

  private onSpeechResults = (e: any) => {
    console.log('Speech results:', e.value);
    if (this.currentResultsCallback && e.value) {
      this.currentResultsCallback(e.value);
    }
  };

  private onSpeechPartialResults = (e: any) => {
    console.log('Partial speech results:', e.value);
    if (this.currentPartialResultsCallback && e.value) {
      this.currentPartialResultsCallback(e.value);
    }
  };

  private onSpeechVolumeChanged = (e: any) => {
    console.log('Speech volume changed:', e.value);
  };

  // TTS event handlers
  private onTtsStart = (_event: any) => {
    console.log('TTS started');
    this.isSpeaking = true;
  };

  private onTtsFinish = (_event: any) => {
    console.log('TTS finished');
    this.isSpeaking = false;
  };

  private onTtsCancel = (_event: any) => {
    console.log('TTS cancelled');
    this.isSpeaking = false;
  };

  // Public methods for speech recognition
  public async startListening(config?: STTConfig): Promise<void> {
    try {
      if (this.isListening) {
        await this.stopListening();
      }

      // Store callbacks for this listening session
      if (config) {
        this.currentResultsCallback = config.onResults;
        this.currentErrorCallback = config.onError;
        this.currentPartialResultsCallback = config.onPartialResults;
      }

      const options = {
        language: config?.language || 'es-ES',
        partialResults: config?.partialResults || true,
        timeout: config?.timeout || 30000,
      };

      await Voice.start(options.language, {
        RECOGNIZER_ENGINE: 'GOOGLE',
        EXTRA_PARTIAL_RESULTS: options.partialResults,
        REQUEST_PERMISSIONS_AUTO: true,
      });
      
      this.isListening = true;
      console.log('Voice recognition started with options:', options);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      if (this.currentErrorCallback) {
        this.currentErrorCallback(error);
      }
      throw error;
    }
  }

  public async stopListening(): Promise<VoiceServiceResponse> {
    try {
      await Voice.stop();
      this.isListening = false;
      
      return {
        success: true,
        text: '', // This will be populated by the results callback
      };
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  public async cancelListening(): Promise<void> {
    try {
      await Voice.cancel();
      this.isListening = false;
    } catch (error) {
      console.error('Error cancelling voice recognition:', error);
      throw error;
    }
  }

  // Public methods for text-to-speech
  public async speak(text: string, config?: TTSConfig): Promise<void> {
    try {
      if (this.isSpeaking) {
        await this.stopSpeaking();
      }

      if (config) {
        if (config.language) Tts.setDefaultLanguage(config.language);
        if (config.rate) Tts.setDefaultRate(config.rate);
        if (config.pitch) Tts.setDefaultPitch(config.pitch);
        if (config.voice) Tts.setDefaultVoice(config.voice);
      }

      await Tts.speak(text);
      console.log('TTS speaking:', text);
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      throw error;
    }
  }

  public async stopSpeaking(): Promise<void> {
    try {
      await Tts.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error('Error stopping TTS:', error);
      throw error;
    }
  }

  // Emergency-specific voice methods
  public async speakEmergencyInstruction(instruction: string): Promise<void> {
    const emergencyConfig: TTSConfig = {
      language: 'es-ES',
      rate: 0.5, // Very slow for emergency instructions
      pitch: 1.0,
    };
    
    await this.speak(instruction, emergencyConfig);
  }

  public async askEmergencyQuestion(question: string): Promise<VoiceServiceResponse> {
    try {
      // First speak the question
      await this.speak(question);
      
      // Wait for TTS to finish
      await this.waitForTTSToFinish();
      
      // Start listening for response
      await this.startListening({
        language: 'es-ES',
        partialResults: true,
        timeout: 30000, // 30 seconds timeout for emergency responses
      });
      
      return {
        success: true,
        text: 'Listening for response...',
      };
    } catch (error) {
      console.error('Error in emergency voice interaction:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Utility methods
  private async waitForTTSToFinish(): Promise<void> {
    return new Promise((resolve) => {
      const checkTTS = () => {
        if (!this.isSpeaking) {
          resolve();
        } else {
          setTimeout(checkTTS, 100);
        }
      };
      checkTTS();
    });
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  public isCurrentlySpeaking(): boolean {
    return this.isSpeaking;
  }

  // Get available voices
  public async getAvailableVoices(): Promise<any[]> {
    try {
      const voices = await Tts.voices();
      return voices;
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  }

  // Emergency quick actions
  public async emergencyAlert(message: string): Promise<void> {
    const alertConfig: TTSConfig = {
      language: 'es-ES',
      rate: 0.7,
      pitch: 1.2, // Higher pitch for urgency
    };
    
    await this.speak(`¡ATENCIÓN! ${message}`, alertConfig);
  }

  // Cleanup
  public cleanup(): void {
    Voice.destroy().then(Voice.removeAllListeners);
    Tts.removeAllListeners('tts-start');
    Tts.removeAllListeners('tts-finish');
    Tts.removeAllListeners('tts-cancel');
  }
}

export default new VoiceService();
