import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  SafeAreaView,
  StatusBar,
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, VoiceInteraction, FirstAidInstruction } from '../models/types';
import voiceService from '../services/voiceService';
import emergencyCategories, { firstAidInstructions } from '../utils/emergencyData';

type VoiceInteractionNavigationProp = StackNavigationProp<RootStackParamList, 'VoiceInteraction'>;
type VoiceInteractionRouteProp = RouteProp<RootStackParamList, 'VoiceInteraction'>;

interface Props {
  navigation: VoiceInteractionNavigationProp;
  route: VoiceInteractionRouteProp;
}

const VoiceInteractionScreen: React.FC<Props> = ({ route }) => {
  const { categoryId, emergencyType } = route.params || {};
  
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [interactions, setInteractions] = useState<VoiceInteraction[]>([]);
  const [instructions, setInstructions] = useState<FirstAidInstruction[]>([]);
  const [emergencyStarted, setEmergencyStarted] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Helper function to add interactions
  const addInteraction = React.useCallback((type: 'user' | 'system', text: string) => {
    const newInteraction: VoiceInteraction = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
    };
    
    setInteractions(prev => [...prev, newInteraction]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  // Emergency call function
  const offerEmergencyCall = React.useCallback(() => {
    Alert.alert(
      'Llamar a Emergencias',
      '¿Deseas llamar al 110 ahora?',
      [
        {
          text: 'No, continuar',
          style: 'cancel',
          onPress: () => {
            setTimeout(() => {
              startListening();
            }, 1000);
          },
        },
        {
          text: 'Sí, llamar 110',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:110').catch((err) => {
              console.error('Error calling emergency:', err);
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          },
        },
      ]
    );
  }, []);

  // Instruction flow functions
  const startNextInstruction = React.useCallback(async () => {
    if (currentStep < instructions.length) {
      const instruction = instructions[currentStep];
      setIsSpeaking(true);
      
      addInteraction('system', instruction.audioText);
      await voiceService.speakEmergencyInstruction(instruction.audioText);
      
      setIsSpeaking(false);
      setCurrentStep(prev => prev + 1);
      
      // After each instruction, ask if they need to continue
      setTimeout(() => {
        askToContinue();
      }, 1000);
    } else {
      // All instructions completed
      const completionMessage = 'Has completado todos los pasos de primeros auxilios. Si la situación no mejora, llama al 110 inmediatamente.';
      addInteraction('system', completionMessage);
      await voiceService.speak(completionMessage);
    }
  }, [currentStep, instructions, addInteraction]);

  const askToContinue = React.useCallback(async () => {
    const question = '¿Está bien? ¿Necesitas continuar con el siguiente paso? Di "sí" para continuar o "ayuda" si necesitas asistencia.';
    setIsSpeaking(true);
    
    addInteraction('system', question);
    await voiceService.speak(question);
    
    setIsSpeaking(false);
    setTimeout(() => {
      startListening();
    }, 1000);
  }, [addInteraction]);

  // Main guidance functions
  const startEmergencyGuidance = React.useCallback(async () => {
    setEmergencyStarted(true);
    const category = emergencyCategories.find(cat => cat.id === categoryId);
    const welcomeMessage = `Hola, voy a ayudarte con ${category?.name}. Vamos a comenzar con los primeros auxilios paso a paso.`;
    
    addInteraction('system', welcomeMessage);
    await voiceService.speak(welcomeMessage);
    
    if (instructions.length > 0) {
      setTimeout(() => {
        startNextInstruction();
      }, 2000);
    }
  }, [categoryId, instructions.length, addInteraction, startNextInstruction]);

  const startGeneralEmergencyAssistance = React.useCallback(async () => {
    setEmergencyStarted(true);
    const welcomeMessage = 'Hola, estoy aquí para ayudarte. ¿Qué tipo de emergencia tienes?';
    
    addInteraction('system', welcomeMessage);
    await voiceService.speak(welcomeMessage);
    
    setTimeout(() => {
      startListening();
    }, 2000);
  }, [addInteraction]);

  // Voice recognition functions
  const startListening = React.useCallback(async () => {
    try {
      setIsListening(true);
      await voiceService.startListening({
        language: 'es-ES',
        partialResults: true,
        timeout: 30000,
        onResults: onVoiceResults,
        onError: onVoiceError,
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      Alert.alert('Error', 'No se pudo activar el reconocimiento de voz');
    }
  }, []);

  const stopListening = React.useCallback(async () => {
    try {
      await voiceService.stopListening();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  }, []);

  // Voice recognition event handlers
  const onVoiceResults = React.useCallback((results: string[]) => {
    if (results && results.length > 0) {
      const recognizedText = results[0].toLowerCase();
      addInteraction('user', results[0]);
      handleVoiceCommand(recognizedText);
    }
    setIsListening(false);
  }, [addInteraction]);

  const onVoiceError = React.useCallback((error: any) => {
    console.error('Voice recognition error:', error);
    setIsListening(false);
    addInteraction('system', 'No pude escuchar claramente. Intenta de nuevo.');
    setTimeout(() => {
      startListening();
    }, 2000);
  }, [addInteraction]);

  // Voice command processing
  const handleVoiceCommand = React.useCallback((command: string) => {
    console.log('Processing voice command:', command);
    
    // Emergency responses
    if (command.includes('ayuda') || command.includes('emergencia') || command.includes('auxilio')) {
      offerEmergencyCall();
      return;
    }
    
    // Positive responses to continue
    if (command.includes('sí') || command.includes('si') || command.includes('continuar') || 
        command.includes('siguiente') || command.includes('ok') || command.includes('bien')) {
      if (!emergencyStarted) {
        startEmergencyGuidance();
      } else {
        startNextInstruction();
      }
      return;
    }
    
    // Negative responses or completion
    if (command.includes('no') || command.includes('terminar') || command.includes('parar') ||
        command.includes('completado') || command.includes('listo')) {
      addInteraction('system', 'Entendido. Si necesitas ayuda, di "ayuda" o llama al 110.');
      return;
    }
    
    // Repetition requests
    if (command.includes('repetir') || command.includes('otra vez') || command.includes('repite')) {
      if (currentStep > 0 && instructions.length > 0) {
        const previousInstruction = instructions[currentStep - 1];
        addInteraction('system', `Repitiendo: ${previousInstruction.audioText}`);
        voiceService.speakEmergencyInstruction(previousInstruction.audioText);
      }
      return;
    }
    
    // Call emergency services
    if (command.includes('llamar') || command.includes('110') || command.includes('emergencia')) {
      offerEmergencyCall();
      return;
    }
    
    // Default response for unclear commands
    addInteraction('system', 'No entendí claramente. Puedes decir "sí" para continuar, "ayuda" para asistencia, o "llamar" para emergencias.');
    setTimeout(() => {
      startListening();
    }, 2000);
  }, [emergencyStarted, currentStep, instructions, offerEmergencyCall, startEmergencyGuidance, startNextInstruction, addInteraction]);

  // Emergency call functions
  const offerEmergencyCall = React.useCallback(() => {
    Alert.alert(
      'Llamar a Emergencias',
      '¿Deseas llamar al 110 ahora?',
      [
        {
          text: 'No, continuar',
          style: 'cancel',
          onPress: () => {
            setTimeout(() => {
              startListening();
            }, 1000);
          },
        },
        {
          text: 'Sí, llamar 110',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:110').catch((err) => {
              console.error('Error calling emergency:', err);
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          },
        },
      ]
    );
  }, [startListening]);

  // Instruction flow functions
  const askToContinue = React.useCallback(async () => {
    const question = '¿Está bien? ¿Necesitas continuar con el siguiente paso? Di "sí" para continuar o "ayuda" si necesitas asistencia.';
    setIsSpeaking(true);
    
    addInteraction('system', question);
    await voiceService.speak(question);
    
    setIsSpeaking(false);
    setTimeout(() => {
      startListening();
    }, 1000);
  }, [addInteraction, startListening]);

  const startNextInstruction = React.useCallback(async () => {
    if (currentStep < instructions.length) {
      const instruction = instructions[currentStep];
      setIsSpeaking(true);
      
      addInteraction('system', instruction.audioText);
      await voiceService.speakEmergencyInstruction(instruction.audioText);
      
      setIsSpeaking(false);
      setCurrentStep(prev => prev + 1);
      
      // After each instruction, ask if they need to continue
      setTimeout(() => {
        askToContinue();
      }, 1000);
    } else {
      // All instructions completed
      const completionMessage = 'Has completado todos los pasos de primeros auxilios. Si la situación no mejora, llama al 110 inmediatamente.';
      addInteraction('system', completionMessage);
      await voiceService.speak(completionMessage);
    }
  }, [currentStep, instructions, addInteraction, askToContinue]);

  // Main guidance functions
  const startEmergencyGuidance = React.useCallback(async () => {
    setEmergencyStarted(true);
    const category = emergencyCategories.find(cat => cat.id === categoryId);
    const welcomeMessage = `Hola, voy a ayudarte con ${category?.name}. Vamos a comenzar con los primeros auxilios paso a paso.`;
    
    addInteraction('system', welcomeMessage);
    await voiceService.speak(welcomeMessage);
    
    if (instructions.length > 0) {
      setTimeout(() => {
        startNextInstruction();
      }, 2000);
    }
  }, [categoryId, instructions.length, addInteraction, startNextInstruction]);

  const startGeneralEmergencyAssistance = React.useCallback(async () => {
    setEmergencyStarted(true);
    const welcomeMessage = 'Hola, estoy aquí para ayudarte. ¿Qué tipo de emergencia tienes?';
    
    addInteraction('system', welcomeMessage);
    await voiceService.speak(welcomeMessage);
    
    setTimeout(() => {
      startListening();
    }, 2000);
  }, [addInteraction, startListening]);

  // Animation functions
  const startPulseAnimation = React.useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const stopPulseAnimation = React.useCallback(() => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [pulseAnim]);

  // Process voice input
  const processVoiceInput = React.useCallback(async (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('sí') || lowerText.includes('si') || lowerText.includes('continuar')) {
      // Continue with next instruction
      startNextInstruction();
    } else if (lowerText.includes('ayuda') || lowerText.includes('emergencia') || lowerText.includes('110')) {
      // Offer to call emergency services
      offerEmergencyCall();
    } else if (lowerText.includes('repetir') || lowerText.includes('otra vez')) {
      // Repeat current instruction
      if (currentStep > 0 && instructions.length > 0) {
        const instruction = instructions[currentStep - 1];
        await voiceService.speak(instruction.audioText);
      }
    } else {
      // General response
      const response = 'Entiendo. Si necesitas ayuda inmediata, di "ayuda" o "110". Para continuar con los primeros auxilios, di "continuar".';
      addInteraction('system', response);
      await voiceService.speak(response);
      
      setTimeout(() => {
        startListening();
      }, 2000);
    }
  }, [currentStep, instructions, addInteraction, startListening, startNextInstruction, offerEmergencyCall]);

  // Effects
  useEffect(() => {
    if (categoryId && firstAidInstructions[categoryId]) {
      setInstructions(firstAidInstructions[categoryId]);
      startEmergencyGuidance();
    } else {
      startGeneralEmergencyAssistance();
    }
    
    return () => {
      voiceService.cleanup();
    };
  }, [categoryId, startEmergencyGuidance, startGeneralEmergencyAssistance]);

  useEffect(() => {
    if (isListening || isSpeaking) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening, isSpeaking, startPulseAnimation, stopPulseAnimation]);

  // UI handlers
  const handleManualEmergencyCall = () => {
    Alert.alert(
      'Llamar a Emergencias',
      '¿Deseas llamar al 110 (Emergencias) ahora?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Llamar 110',
          style: 'destructive',
          onPress: () => {
            Linking.openURL('tel:110').catch((err) => {
              console.error('Error calling emergency:', err);
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          },
        },
      ]
    );
  };

  const renderInteraction = (interaction: VoiceInteraction) => (
    <View
      key={interaction.id}
      style={[
        styles.interactionBubble,
        interaction.type === 'user' ? styles.userBubble : styles.systemBubble,
      ]}
    >
      <Text
        style={[
          styles.interactionText,
          interaction.type === 'user' ? styles.userText : styles.systemText,
        ]}
      >
        {interaction.text}
      </Text>
      <Text style={styles.timestampText}>
        {interaction.timestamp.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C0392B" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {emergencyType || 'Asistente de Emergencia'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {emergencyStarted ? 'Guía activa' : 'Preparando asistencia...'}
        </Text>
      </View>

      {/* Emergency Call Button */}
      <TouchableOpacity 
        style={styles.emergencyCallButton}
        onPress={handleManualEmergencyCall}
      >
        <Text style={styles.emergencyCallText}>📞 LLAMAR AL 110</Text>
      </TouchableOpacity>

      {/* Conversation Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.conversationArea}
        contentContainerStyle={styles.conversationContent}
        showsVerticalScrollIndicator={false}
      >
        {interactions.map(renderInteraction)}
      </ScrollView>

      {/* Voice Control Panel */}
      <View style={styles.controlPanel}>
        <View style={styles.voiceButtonContainer}>
          <Animated.View
            style={[
              styles.voiceButton,
              { transform: [{ scale: pulseAnim }] },
              (isListening || isSpeaking) && styles.voiceButtonActive,
            ]}
          >
            <TouchableOpacity
              style={styles.voiceButtonInner}
              onPress={isListening ? stopListening : startListening}
              disabled={isSpeaking}
            >
              <Text style={styles.voiceButtonIcon}>
                {isSpeaking ? '🔊' : isListening ? '🎤' : '🎙️'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        
        <Text style={styles.statusText}>
          {isSpeaking 
            ? 'Hablando...' 
            : isListening 
            ? 'Escuchando...' 
            : 'Toca para hablar'
          }
        </Text>

        {/* Progress Indicator */}
        {instructions.length > 0 && (
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Paso {Math.min(currentStep + 1, instructions.length)} de {instructions.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentStep / instructions.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#E74C3C',
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginTop: 5,
  },
  emergencyCallButton: {
    backgroundColor: '#C0392B',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  emergencyCallText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  conversationArea: {
    flex: 1,
    paddingHorizontal: 15,
  },
  conversationContent: {
    paddingVertical: 15,
  },
  interactionBubble: {
    marginVertical: 5,
    padding: 15,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#3498DB',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  systemBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  interactionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  systemText: {
    color: '#2C3E50',
  },
  timestampText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },
  controlPanel: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    alignItems: 'center',
  },
  voiceButtonContainer: {
    marginBottom: 10,
  },
  voiceButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498DB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  voiceButtonActive: {
    backgroundColor: '#E74C3C',
  },
  voiceButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonIcon: {
    fontSize: 32,
  },
  statusText: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 15,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E1E8ED',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27AE60',
  },
});

export default VoiceInteractionScreen;
