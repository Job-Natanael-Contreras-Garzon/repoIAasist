import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface EmergencyButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  onPress,
  icon,
  backgroundColor = '#E74C3C',
  textColor = '#FFFFFF',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 60,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EmergencyButton;
