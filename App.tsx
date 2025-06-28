/**
 * EmergencyFirstAidAIApp
 * React Native emergency medical assistance application
 */

import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import offlineService from './src/services/offlineService';
import permissionsService from './src/services/permissionsService';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize app on startup
    const initializeApp = async () => {
      try {
        // Initialize offline data
        await offlineService.initializeOfflineData();
        
        // Update offline data if needed
        await offlineService.updateOfflineDataIfNeeded();
        
        // Request necessary permissions
        await permissionsService.requestAllPermissions();
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
  }, []);

  return <AppNavigator />;
};

export default App;
