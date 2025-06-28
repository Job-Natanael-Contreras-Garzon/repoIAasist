import { PermissionsAndroid, Platform, Alert } from 'react-native';

class PermissionsService {
  // Request microphone permission for voice recognition
  async requestMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permiso de Micrófono',
            message: 'Esta aplicación necesita acceso al micrófono para reconocimiento de voz durante emergencias.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting microphone permission:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  }

  // Request phone call permission
  async requestPhonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          {
            title: 'Permiso de Llamadas',
            message: 'Esta aplicación necesita permiso para realizar llamadas de emergencia al 110.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting phone permission:', err);
        return false;
      }
    }
    return true; // iOS handles permissions automatically
  }

  // Check if microphone permission is granted
  async checkMicrophonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        return hasPermission;
      } catch (err) {
        console.warn('Error checking microphone permission:', err);
        return false;
      }
    }
    return true;
  }

  // Check if phone permission is granted
  async checkPhonePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CALL_PHONE
        );
        return hasPermission;
      } catch (err) {
        console.warn('Error checking phone permission:', err);
        return false;
      }
    }
    return true;
  }

  // Request all emergency-related permissions
  async requestEmergencyPermissions(): Promise<boolean> {
    const micPermission = await this.requestMicrophonePermission();
    const phonePermission = await this.requestPhonePermission();

    if (!micPermission) {
      Alert.alert(
        'Permiso de Micrófono Requerido',
        'El reconocimiento de voz no funcionará sin permiso de micrófono. Puedes habilitarlo en configuración.',
        [{ text: 'OK' }]
      );
    }

    if (!phonePermission) {
      Alert.alert(
        'Permiso de Llamadas Requerido',
        'No se podrán realizar llamadas de emergencia automáticas sin este permiso.',
        [{ text: 'OK' }]
      );
    }

    return micPermission && phonePermission;
  }

  // Request all emergency-related permissions
  async requestAllPermissions(): Promise<{
    microphone: boolean;
    phone: boolean;
    allGranted: boolean;
  }> {
    const microphone = await this.requestMicrophonePermission();
    const phone = await this.requestPhonePermission();

    return {
      microphone,
      phone,
      allGranted: microphone && phone,
    };
  }

  // Check all emergency-related permissions
  async checkEmergencyPermissions(): Promise<{
    microphone: boolean;
    phone: boolean;
    allGranted: boolean;
  }> {
    const microphone = await this.checkMicrophonePermission();
    const phone = await this.checkPhonePermission();

    return {
      microphone,
      phone,
      allGranted: microphone && phone,
    };
  }
}

export default new PermissionsService();
