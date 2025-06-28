import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import offlineService from '../services/offlineService';

interface EmergencyTipsProps {
  onClose: () => void;
}

const EmergencyTips: React.FC<EmergencyTipsProps> = ({ onClose }) => {
  const basicTips = offlineService.getBasicFirstAidTips();
  const emergencyNumbers = offlineService.getEmergencyNumbers();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Consejos de Emergencia</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🩺 Primeros Auxilios Básicos</Text>
          {basicTips.map((tip, index) => (
            <View key={index} style={styles.tipContainer}>
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Emergency Numbers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Números de Emergencia</Text>
          {Object.entries(emergencyNumbers).map(([service, number]) => (
            <View key={service} style={styles.numberContainer}>
              <Text style={styles.serviceName}>{service}</Text>
              <Text style={styles.serviceNumber}>{number}</Text>
            </View>
          ))}
        </View>

        {/* Important Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Importante</Text>
          <View style={styles.noteContainer}>
            <Text style={styles.noteText}>
              • Esta información es solo para emergencias básicas
            </Text>
            <Text style={styles.noteText}>
              • Siempre busca ayuda médica profesional
            </Text>
            <Text style={styles.noteText}>
              • En caso de duda, llama al 110 inmediatamente
            </Text>
            <Text style={styles.noteText}>
              • Mantén la calma y sigue las instrucciones paso a paso
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#E74C3C',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  tipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: '#3498DB',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 25,
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  serviceName: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  serviceNumber: {
    fontSize: 18,
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  noteContainer: {
    backgroundColor: '#FFF3CD',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F39C12',
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default EmergencyTips;
