//Навбар заказа
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NavBarProps {
  restaurantName?: string;
  restaurantId?: string; // 👈 добавляем id ресторана
  showBackButton?: boolean;
}

export default function NavBar({restaurantName, restaurantId}: NavBarProps) {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const handleBack = () => {
  router.push({
    pathname: '/Menu',
    params: {
      restaurantId,
      restaurantName,
    },
  });
};

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Image 
          source={require('../../../assets/images/back_arrow.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.title}>
        {restaurantName || 'Ресторан'}
      </Text>
      <View style={styles.orderContainer}>
        <TouchableOpacity style={styles.orderButton}>
          <Image 
            source={require('../../../assets/images/order_icon.png')}
            style={styles.orderIcon}
          />
          {/* Бейдж с количеством */}
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {totalItems > 99 ? '99+' : totalItems}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 25 : 0, // Простой отступ для Android
    height: Platform.OS === 'android' ? 85 : 60, // Увеличиваем высоту для Android
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  orderContainer: {
    position: 'relative',
  },
  orderButton: {
    padding: 8,
  },
  orderIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#C6E583',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#black',
    fontSize: 12,
    fontWeight: 'bold',
  },
}); 