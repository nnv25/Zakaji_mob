import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface OrderModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function OrderModal({ visible, onClose }: OrderModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* 🔥 Новый фон как в LogoutModal */}
      <View style={styles.modalOverlay}>

        {/* 🔥 Серый контейнер как в LogoutModal */}
        <View style={styles.blurContainer}>
          <View style={styles.modalContent}>

            {/* Кнопка закрытия */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <View style={styles.closeButtonBackground}>
                <Ionicons name="close" size={20} color="#000" />
              </View>
            </TouchableOpacity>

            {/* Изображение */}
            <Image
              source={require('../../../assets/images/ready2.png')}
              style={styles.readyImage}
              resizeMode="contain"
            />

            <Text style={styles.confirmSubtitle}>Ожидайте.</Text>

          </View>
        </View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // 🔥 Тот же overlay, что в LogoutModal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // 🔥 Тот же серый фон, что в LogoutModal
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#F2F2F2',
  },

  // 🔥 Тот же блок, что в LogoutModal
  modalContent: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
  },

  /* ⬇️ остальное НЕ менял */
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
  readyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  confirmSubtitle: {
    fontSize: 18,
    fontStyle: 'italic',
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
