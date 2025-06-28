import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

// Initialize Firebase
export const initializeFirebase = () => {
  // Firebase is automatically initialized with React Native Firebase
  console.log('Firebase initialized successfully');
};

// Auth service
export const authService = {
  // Sign in anonymously for quick access during emergencies
  signInAnonymously: async () => {
    try {
      await auth().signInAnonymously();
      console.log('User signed in anonymously');
    } catch (error) {
      console.error('Anonymous sign-in error:', error);
      throw error;
    }
  },

  // Sign in with email and password
  signInWithEmailPassword: async (email: string, password: string) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      console.log('User signed in with email');
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  },

  // Create user with email and password
  createUserWithEmailPassword: async (email: string, password: string) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.log('User created successfully');
    } catch (error) {
      console.error('User creation error:', error);
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await auth().signOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth().currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
  },
};

// Firestore service
export const firestoreService = {
  // Collections
  collections: {
    users: 'users',
    emergencySessions: 'emergencySessions',
    emergencyCategories: 'emergencyCategories',
    firstAidInstructions: 'firstAidInstructions',
  },

  // Save emergency session
  saveEmergencySession: async (sessionData: any) => {
    try {
      const docRef = await firestore()
        .collection('emergencySessions')
        .add({
          ...sessionData,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Emergency session saved:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error saving emergency session:', error);
      throw error;
    }
  },

  // Update emergency session
  updateEmergencySession: async (sessionId: string, updateData: any) => {
    try {
      await firestore()
        .collection('emergencySessions')
        .doc(sessionId)
        .update({
          ...updateData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      console.log('Emergency session updated');
    } catch (error) {
      console.error('Error updating emergency session:', error);
      throw error;
    }
  },

  // Get emergency categories
  getEmergencyCategories: async () => {
    try {
      const snapshot = await firestore()
        .collection('emergencyCategories')
        .orderBy('order')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting emergency categories:', error);
      throw error;
    }
  },

  // Get first aid instructions for category
  getFirstAidInstructions: async (categoryId: string) => {
    try {
      const snapshot = await firestore()
        .collection('firstAidInstructions')
        .where('categoryId', '==', categoryId)
        .orderBy('step')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting first aid instructions:', error);
      throw error;
    }
  },

  // Save user data
  saveUserData: async (userId: string, userData: any) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .set({
          ...userData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      console.log('User data saved');
    } catch (error) {
      console.error('Error saving user data:', error);
      throw error;
    }
  },

  // Get user emergency history
  getUserEmergencyHistory: async (userId: string) => {
    try {
      const snapshot = await firestore()
        .collection('emergencySessions')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting user emergency history:', error);
      throw error;
    }
  },
};

// Cloud Functions service
export const functionsService = {
  // Process voice input with AI
  processVoiceInput: async (voiceText: string, context: any) => {
    try {
      const processVoice = functions().httpsCallable('processVoiceInput');
      const result = await processVoice({
        voiceText,
        context,
      });
      return result.data;
    } catch (error) {
      console.error('Error processing voice input:', error);
      throw error;
    }
  },

  // Generate AI response
  generateAIResponse: async (userInput: string, emergencyContext: any) => {
    try {
      const generateResponse = functions().httpsCallable('generateAIResponse');
      const result = await generateResponse({
        userInput,
        emergencyContext,
      });
      return result.data;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  },

  // Convert text to speech
  textToSpeech: async (text: string, config: any) => {
    try {
      const tts = functions().httpsCallable('textToSpeech');
      const result = await tts({
        text,
        config,
      });
      return result.data;
    } catch (error) {
      console.error('Error with text to speech:', error);
      throw error;
    }
  },
};

export default {
  initializeFirebase,
  authService,
  firestoreService,
  functionsService,
};
