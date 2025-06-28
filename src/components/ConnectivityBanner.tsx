import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface ConnectivityBannerProps {
  onConnectivityChange?: (isConnected: boolean) => void;
}

const ConnectivityBanner: React.FC<ConnectivityBannerProps> = ({ onConnectivityChange }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected === true && state.isInternetReachable === true;
      
      // Show banner for offline mode
      setShowBanner(!connected);
      
      if (onConnectivityChange) {
        onConnectivityChange(connected);
      }
    });

    return () => unsubscribe();
  }, [onConnectivityChange]);

  if (!showBanner) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        📶 Modo Offline - Funciones básicas disponibles
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F39C12',
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ConnectivityBanner;
