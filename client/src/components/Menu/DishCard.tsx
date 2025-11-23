//карточка блюда
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import ModalCard from '../Modal/ModalCard';

interface DishCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  weight: string;
  rating: number;
  image: any;
  onOrder?: () => void;
  index: number;
}

export default function DishCard({
  id,
  title,
  description,
  price,
  weight,
  rating,
  image,
  onOrder,
  index,
}: DishCardProps) {
  const { addToCart } = useCart();
  const [isModalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart({
        id,
        title,
        price,
        image,
        weight,
        quantity,
      });

      if (onOrder) {
        onOrder();
      }
      setQuantity(0);
      setModalVisible(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : 0));
  };

  const handleCardPress = () => {
    setModalVisible(true);
    setQuantity(0);
  };

  return (
    <>
      {/* Карточка блюда */}
      <TouchableOpacity style={styles.card} onPress={handleCardPress}>
        <Image source={image} style={styles.image} />
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.rating}>⭐ {rating.toFixed(1)}</Text>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>

        <Text style={styles.weight}>{weight}</Text>
        <Text style={styles.price}>₽ {price}</Text>

        <View style={styles.buttonContainer}>
          <Button
            title="Заказать"
            onPress={(e) => {
              e.stopPropagation();
              addToCart({
                id,
                title,
                price,
                image,
                weight,
                quantity: 1,
              });
              if (onOrder) {
                onOrder();
              }
            }}
          />
        </View>
      </TouchableOpacity>

      {/* Модальное окно */}
      <ModalCard
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title={title}
        description={description}
        price={price}
        weight={weight}
        rating={rating}
        image={image}
        quantity={quantity}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  rating: {
    color: '#999',
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    color: '#666',
    fontSize: 13,
    marginVertical: 4,
    lineHeight: 16,
    height: 32,
  },
  weight: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginVertical: 6,
  },
  buttonContainer: {
    marginTop: 'auto',
  },
});