import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirstAidInstruction, OfflineData } from '../models/types';
import emergencyCategories, { firstAidInstructions } from '../utils/emergencyData';

const OFFLINE_DATA_KEY = '@EmergencyApp:offlineData';
const EMERGENCY_HISTORY_KEY = '@EmergencyApp:history';

class OfflineService {
  // Save offline data for emergency access
  async saveOfflineData(): Promise<void> {
    try {
      const offlineData: OfflineData = {
        categories: emergencyCategories,
        basicInstructions: this.getAllInstructions(),
        lastUpdated: new Date(),
      };
      
      await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
      console.log('Offline data saved successfully');
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }

  // Load offline data
  async loadOfflineData(): Promise<OfflineData | null> {
    try {
      const storedData = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
      if (storedData) {
        const offlineData = JSON.parse(storedData);
        // Convert date string back to Date object
        offlineData.lastUpdated = new Date(offlineData.lastUpdated);
        return offlineData;
      }
      return null;
    } catch (error) {
      console.error('Error loading offline data:', error);
      return null;
    }
  }

  // Check if offline data is available
  async isOfflineDataAvailable(): Promise<boolean> {
    try {
      const data = await this.loadOfflineData();
      return data !== null;
    } catch (error) {
      console.error('Error checking offline data:', error);
      return false;
    }
  }

  // Get all instructions from all categories
  private getAllInstructions(): FirstAidInstruction[] {
    const allInstructions: FirstAidInstruction[] = [];
    
    Object.values(firstAidInstructions).forEach(categoryInstructions => {
      allInstructions.push(...categoryInstructions);
    });
    
    return allInstructions;
  }

  // Get instructions for a specific category from offline data
  async getOfflineInstructions(categoryId: string): Promise<FirstAidInstruction[]> {
    try {
      const offlineData = await this.loadOfflineData();
      if (!offlineData) {
        // Fallback to local data
        return firstAidInstructions[categoryId] || [];
      }
      
      // Filter instructions by category from offline data
      const category = offlineData.categories.find(cat => cat.id === categoryId);
      return category?.instructions || [];
    } catch (error) {
      console.error('Error getting offline instructions:', error);
      // Fallback to local data
      return firstAidInstructions[categoryId] || [];
    }
  }

  // Save emergency interaction history
  async saveEmergencyHistory(interaction: {
    categoryId?: string;
    emergencyType?: string;
    timestamp: Date;
    duration: number;
    completed: boolean;
  }): Promise<void> {
    try {
      const existingHistory = await this.getEmergencyHistory();
      const newHistory = [...existingHistory, interaction];
      
      // Keep only last 50 interactions
      const limitedHistory = newHistory.slice(-50);
      
      await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(limitedHistory));
      console.log('Emergency history saved');
    } catch (error) {
      console.error('Error saving emergency history:', error);
    }
  }

  // Get emergency interaction history
  async getEmergencyHistory(): Promise<any[]> {
    try {
      const storedHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
      if (storedHistory) {
        const history = JSON.parse(storedHistory);
        // Convert date strings back to Date objects
        return history.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading emergency history:', error);
      return [];
    }
  }

  // Clear all offline data (for debugging or reset)
  async clearOfflineData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OFFLINE_DATA_KEY);
      await AsyncStorage.removeItem(EMERGENCY_HISTORY_KEY);
      console.log('Offline data cleared');
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }

  // Initialize offline data on app first run
  async initializeOfflineData(): Promise<void> {
    try {
      const isAvailable = await this.isOfflineDataAvailable();
      if (!isAvailable) {
        await this.saveOfflineData();
        console.log('Initial offline data saved');
      }
    } catch (error) {
      console.error('Error initializing offline data:', error);
    }
  }

  // Update offline data if needed (check age)
  async updateOfflineDataIfNeeded(): Promise<void> {
    try {
      const offlineData = await this.loadOfflineData();
      if (!offlineData) {
        await this.saveOfflineData();
        return;
      }

      // Update if data is older than 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      if (offlineData.lastUpdated < sevenDaysAgo) {
        await this.saveOfflineData();
        console.log('Offline data updated due to age');
      }
    } catch (error) {
      console.error('Error updating offline data:', error);
    }
  }

  // Get basic first aid tips for offline mode
  getBasicFirstAidTips(): string[] {
    return [
      'Mantén la calma en toda situación de emergencia',
      'Verifica que el área sea segura antes de actuar',
      'Llama al 110 inmediatamente en emergencias graves',
      'No muevas a una persona con posible lesión espinal',
      'Aplica presión directa en heridas que sangran',
      'En caso de quemaduras, enfría con agua durante 10-20 minutos',
      'Para atragantamiento: 5 golpes en la espalda, 5 compresiones abdominales',
      'En desmayos: acuesta a la persona y eleva las piernas',
      'RCP: 30 compresiones, 2 respiraciones, ritmo 100-120/min',
      'Mantén a la víctima abrigada y cómoda',
    ];
  }

  // Get emergency numbers for Bolivia
  getEmergencyNumbers(): { [key: string]: string } {
    return {
      'Emergencias Generales': '110',
      'Bomberos': '119',
      'Cruz Roja': '122',
      'Policía': '110',
      'SAMES': '168',
    };
  }
}

export default new OfflineService();
