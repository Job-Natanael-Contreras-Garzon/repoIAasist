import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../models/types';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import EmergencyCategoriesScreen from '../screens/EmergencyCategoriesScreen';
import VoiceInteractionScreen from '../screens/VoiceInteractionScreen';
import EmergencyCallScreen from '../screens/EmergencyCallScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#E74C3C',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EmergencyCategories" 
          component={EmergencyCategoriesScreen}
          options={{ 
            title: 'Primeros Auxilios',
            headerLeft: undefined, // Prevent going back from main screen
          }}
        />
        <Stack.Screen 
          name="VoiceInteraction" 
          component={VoiceInteractionScreen}
          options={{ 
            title: 'Asistente de Emergencia',
            gestureEnabled: false, // Prevent swipe back during emergency
          }}
        />
        <Stack.Screen 
          name="EmergencyCall" 
          component={EmergencyCallScreen}
          options={{ 
            title: 'Llamada de Emergencia',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Configuración' }}
        />
        <Stack.Screen 
          name="History" 
          component={HistoryScreen}
          options={{ title: 'Historial' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
