import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, EmergencyCategory } from '../models/types';
import emergencyCategories from '../utils/emergencyData';
import ConnectivityBanner from '../components/ConnectivityBanner';

type EmergencyCategoriesNavigationProp = StackNavigationProp<RootStackParamList, 'EmergencyCategories'>;

interface Props {
  navigation: EmergencyCategoriesNavigationProp;
}

const EmergencyCategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [categories] = useState<EmergencyCategory[]>(emergencyCategories);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initialize any necessary services here
    console.log('Emergency Categories Screen loaded');
  }, []);

  const handleConnectivityChange = (connected: boolean) => {
    setIsConnected(connected);
    if (!connected) {
      console.log('App is offline - limited functionality available');
    }
  };

  const handleCategoryPress = (category: EmergencyCategory) => {
    navigation.navigate('VoiceInteraction', {
      categoryId: category.id,
      emergencyType: category.name,
    });
  };

  const handleEmergencyCall = () => {
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
              console.error('Error al intentar llamar:', err);
              Alert.alert('Error', 'No se pudo realizar la llamada');
            });
          },
        },
      ]
    );
  };

  const getIconForCategory = (iconName: string): string => {
    const iconMap: { [key: string]: string } = {
      medical: '🏥',
      fire: '🔥',
      'wb-sunny': '☀️',
      warning: '⚠️',
      person: '👤',
      favorite: '❤️',
    };
    return iconMap[iconName] || '🚑';
  };

  const renderCategoryCard = (category: EmergencyCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { borderLeftColor: category.color }]}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
          <Text style={styles.categoryIcon}>
            {getIconForCategory(category.icon)}
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#C0392B" />
      
      {/* Connectivity Banner */}
      <ConnectivityBanner onConnectivityChange={handleConnectivityChange} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>¿Qué tipo de emergencia tienes?</Text>
        <Text style={styles.headerSubtitle}>Selecciona la categoría más cercana a tu situación</Text>
        {!isConnected && (
          <Text style={styles.offlineNotice}>Modo offline activo</Text>
        )}
      </View>

      {/* Emergency Call Button */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergencyCall}
        activeOpacity={0.8}
      >
        <Text style={styles.emergencyButtonIcon}>📞</Text>
        <Text style={styles.emergencyButtonText}>LLAMAR AL 110</Text>
        <Text style={styles.emergencyButtonSubtext}>Emergencias</Text>
      </TouchableOpacity>

      {/* Categories Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Categorías de Primeros Auxilios</Text>
        
        <View style={styles.categoriesContainer}>
          {categories.map(renderCategoryCard)}
        </View>

        {/* Quick Access Instructions */}
        <View style={styles.quickAccessContainer}>
          <Text style={styles.quickAccessTitle}>Acceso Rápido</Text>
          <TouchableOpacity
            style={styles.quickAccessButton}
            onPress={() => navigation.navigate('VoiceInteraction', {})}
          >
            <Text style={styles.quickAccessIcon}>🎤</Text>
            <Text style={styles.quickAccessText}>Activar Asistente de Voz</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            En caso de emergencia grave, siempre llama al 110 primero
          </Text>
        </View>
      </ScrollView>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
  },
  offlineNotice: {
    fontSize: 14,
    color: '#F39C12',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  emergencyButton: {
    backgroundColor: '#C0392B',
    margin: 20,
    marginBottom: 10,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emergencyButtonIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  emergencyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  emergencyButtonSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryIcon: {
    fontSize: 30,
  },
  textContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  arrowContainer: {
    paddingLeft: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#BDC3C7',
  },
  quickAccessContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  quickAccessButton: {
    backgroundColor: '#3498DB',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  footer: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#ECF0F1',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmergencyCategoriesScreen;
