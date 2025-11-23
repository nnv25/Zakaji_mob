import React, { useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LogoutModalProps {
  visible: boolean;
  fadeAnim: Animated.Value;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({ visible, fadeAnim, onClose, onLogout }: LogoutModalProps) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await AsyncStorage.removeItem('user');
      Alert.alert('Выход', 'Вы успешно вышли из аккаунта');
      onLogout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
      Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        
        {/* заменили BlurView → View, фон теперь серый */}
        <View style={styles.blurContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonBackground}>
                <Ionicons name="close" size={20} color="#000" />
              </View>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              Вы действительно хотите выйти из аккаунта?
            </Text>

            <TouchableOpacity
              style={[styles.logoutButton, loading && styles.disabledButton]}
              onPress={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.logoutText}>Выйти</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // 🔥 ФОН КАК В МАКЕТЕ — светло-серый
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#F2F2F2', // ← заменено
  },

  modalContent: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#F2F2F2', // ← заменено
  },

  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  closeButtonBackground: {
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#E6E6E6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: '#000',
  },
  logoutButton: {
    backgroundColor: '#CDE589',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

