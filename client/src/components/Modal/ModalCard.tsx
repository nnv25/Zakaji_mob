import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Button from '../ui/Button';
import { Ionicons } from '@expo/vector-icons';

interface ModalCardProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  price: number;
  weight: string;
  rating: number;
  image: any;
  quantity: number;
  onIncreaseQuantity: () => void;
  onDecreaseQuantity: () => void;
  onAddToCart: () => void;
}

export default function ModalCard({
  isVisible,
  onClose,
  title,
  description,
  price,
  weight,
  rating,
  image,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onAddToCart,
}: ModalCardProps) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropOpacity={0.25}
      style={{ margin: 0 }}
    >
      {/* 🔥 Новый фон как в LogoutModal */}
      <View style={styles.modalOverlay}>
        <View style={styles.blurContainer}>

          {/* ВАЖНО — всё внутри blurContainer мы НЕ меняем */}
          <View style={styles.modalContent}>
            {/* Верхняя часть с изображением */}
            <View style={styles.imageContainer}>
              <Image source={image} style={styles.modalImage} />
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={onClose}
              >
                <View style={styles.closeButtonBackground}>
                  <Ionicons name="close" size={20} color="#000" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalTitle}>{title}</Text>

              <View style={styles.ratingRow}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F5B800" />
                  <Text style={styles.modalRating}>{rating.toFixed(1)}</Text>
                </View>
                <Text style={styles.modalWeight}>{weight}</Text>
              </View>

              <Text style={styles.modalDescription}>{description}</Text>

              {/* Счётчик количества */}
              <View style={styles.quantitySection}>
                <Text style={styles.quantityLabel}>Количество:</Text>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity 
                    style={[styles.quantityButton, quantity === 0 && styles.disabledButton]}
                    onPress={onDecreaseQuantity}
                    disabled={quantity === 0}
                  >
                    <Ionicons name="remove" size={20} color={quantity === 0 ? '#999' : '#000'} />
                  </TouchableOpacity>

                  <Text style={styles.quantity}>{quantity}</Text>

                  <TouchableOpacity 
                    style={styles.quantityButton} 
                    onPress={onIncreaseQuantity}
                  >
                    <Ionicons name="add" size={20} color="#000" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.modalFooter}>
                <View style={styles.priceContainer}>
                  <Text style={styles.totalPrice}>Сумма:</Text>
                  <Text style={styles.modalPrice}>₽ {price * quantity}</Text>
                </View>
                <View style={styles.modalButton}>
                  <Button
                    title={quantity === 0 ? "Заказать" : `Заказать ${quantity} шт`}
                    onPress={onAddToCart}
                    disabled={quantity === 0}
                  />
                </View>
              </View>

            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // 🔥 Новый фон из LogoutModal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // 🔥 Новый контейнер как в LogoutModal
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#F2F2F2',
  },

  modalContent: {
    borderRadius: 24,
    overflow: 'hidden',
  },

  /* ⬇️ ДАЛЕЕ — ВСЕ ТВОИ СТАРЫЕ СТИЛИ, НЕ ИЗМЕНЯЮ */
  imageContainer: {
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: 220,
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
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  modalBody: {
    padding: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: 'black',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRating: {
    fontSize: 14,
    color: '#000',
    marginLeft: 6,
    fontWeight: '500',
  },
  modalWeight: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
    marginBottom: 24,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#C6E583",
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
    color: '#000',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  totalPrice: {
    fontSize: 14,
    color: '#000',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  modalButton: {
    flex: 1,
    marginLeft: 16,
  },
});
