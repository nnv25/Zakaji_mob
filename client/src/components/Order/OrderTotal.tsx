{/*import { useCart } from '@/context/CartContext';
import React, { useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import RegistrationModal from '../Modal/RegistrationModal';
import OrderModal from '../Modal/OrderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/config/env';

interface OrderTotalProps {
  tableNumber: string;
  message: string;
}

export default function OrderTotal({ tableNumber, message }: OrderTotalProps) {
  const { getTotalPrice, cartItems, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const params = useLocalSearchParams();
  const restaurantId = params.restaurantId as string;

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);


  
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert('Добавьте товары в корзину');
      return;
    }

    const savedUser = await AsyncStorage.getItem('user');
    if (savedUser) {
      
      await handleSendOrder(JSON.parse(savedUser));
      return;
    }

    
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  
  const handleSendOrder = async (user: any) => {
    try {
      console.log("📦 Отправка заказа на сервер:");
      console.log("user:", user);
      console.log("restaurantId:", restaurantId);
      console.log("items:", cartItems);
      console.log("tableNumber:", tableNumber);
      console.log("comment:", message);
      console.log("totalPrice:", totalPrice);

      const orderData = {
        userId: user._id,
        restaurantId,
        items: cartItems.map((item) => ({
          food: item.id,
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
          image: item.imageUrl,
        })),
        tableNumber,
        comment: message,
        totalPrice,
      };

      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('✅ Заказ оформлен', 'Ваш заказ успешно создан!');
        clearCart();
        setConfirmVisible(true);
      } else {
        Alert.alert('Ошибка', data.message || 'Не удалось оформить заказ');
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

 
  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  
  const handleCloseConfirm = () => {
    setConfirmVisible(false);
    clearCart();
  };

  
  const isFormValid = name.trim() !== '' && phone.length >= 18 && agree1 && agree2;

  
  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      const cleanedPhone = phone.replace(/\s|\(|\)|-/g, '');

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: cleanedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        if (data.isLogin) {
          Alert.alert('Вход', 'Вы успешно вошли в аккаунт!');
        } else {
          Alert.alert('Регистрация', 'Вы успешно зарегистрировались!');
        }

        handleCloseModal();
        await handleSendOrder(data.user);
      } else {
        Alert.alert('Ошибка', data.message || 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} ₽</Text>

      <TouchableOpacity
        style={[styles.orderButton, cartItems.length === 0 && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.orderButtonText}>Оформить заказ</Text>
      </TouchableOpacity>

      
      <RegistrationModal
        visible={modalVisible}
        fadeAnim={fadeAnim}
        onClose={handleCloseModal}
        onRegister={handleRegister}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        agree1={agree1}
        setAgree1={setAgree1}
        agree2={agree2}
        setAgree2={setAgree2}
        isFormValid={isFormValid}
      />

      <OrderModal visible={confirmVisible} onClose={handleCloseConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
  },
  totalPrice: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  orderButton: {
    backgroundColor: '#CDE589',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: 200,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});*/}
import { useCart } from '@/context/CartContext';
import React, { useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import RegistrationModal from '../Modal/RegistrationModal';
import OrderModal from '../Modal/OrderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import { API_URL } from '@/config/env';

interface OrderTotalProps {
  tableNumber: string;
  message: string;
  setTableError: (text: string) => void;
}

export default function OrderTotal({ tableNumber, message, setTableError }: OrderTotalProps) {
  const { getTotalPrice, cartItems, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  const params = useLocalSearchParams();
  const restaurantId = params.restaurantId as string;

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);

  /** 🔹 Открытие модалки если юзер не зарегистрирован */
  const handlePlaceOrder = async () => {
    if (!tableNumber.trim()) {
      setTableError("Укажите номер стола");
      return;
    } else {
      setTableError("");
    }

    if (cartItems.length === 0) {
      alert('Добавьте товары в корзину');
      return;
    }

    const savedUser = await AsyncStorage.getItem('user');
    if (savedUser) {
      await handleSendOrder(JSON.parse(savedUser));
      return;
    }

    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  /** 🔹 Отправка заказа */
  const handleSendOrder = async (user: any) => {
    try {
      console.log("📦 Отправка заказа на сервер:");
      console.log("items:", cartItems);

      const orderData = {
        userId: user._id,
        restaurantId,
        items: cartItems.map((item) => {
          const imageFilename = item.image?.uri
            ? item.image.uri.split('/').pop()
            : null;

          return {
            food: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            weight: item.weight,
            image: imageFilename,       // ✅ ОТПРАВЛЯЕМ ИМЯ ФАЙЛА
          };
        }),
        tableNumber,
        comment: message,
        totalPrice,
      };

      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert('✅ Заказ оформлен', 'Ваш заказ успешно создан!');
        clearCart();
        setConfirmVisible(true);
      } else {
        Alert.alert('Ошибка', data.message || 'Не удалось оформить заказ');
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  /** 🔹 Закрыть модалку */
  const handleCloseModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  /** 🔹 Закрыть окно подтверждения */
  const handleCloseConfirm = () => {
    setConfirmVisible(false);
    clearCart();
  };

  /** 🔹 Валидация */
  const isFormValid = name.trim() !== '' && phone.length >= 18 && agree1 && agree2;

  /** 🔹 Регистрация и заказ */
  const handleRegister = async () => {
    if (!isFormValid) return;

    try {
      const cleanedPhone = phone.replace(/\s|\(|\)|-/g, '');

      const response = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone: cleanedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(data.user));

        Alert.alert(
          data.isLogin ? 'Вход' : 'Регистрация',
          data.isLogin ? 'Вы успешно вошли!' : 'Вы успешно зарегистрировались!'
        );

        handleCloseModal();
        await handleSendOrder(data.user);
      } else {
        Alert.alert('Ошибка', data.message || 'Не удалось зарегистрироваться');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalPrice}>{totalPrice.toFixed(2)} ₽</Text>

      <TouchableOpacity
        style={[styles.orderButton, cartItems.length === 0 && styles.disabledButton]}
        onPress={handlePlaceOrder}
        disabled={cartItems.length === 0}
      >
        <Text style={styles.orderButtonText}>Оформить заказ</Text>
      </TouchableOpacity>

      <RegistrationModal
        visible={modalVisible}
        fadeAnim={fadeAnim}
        onClose={handleCloseModal}
        onRegister={handleRegister}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        agree1={agree1}
        setAgree1={setAgree1}
        agree2={agree2}
        setAgree2={setAgree2}
        isFormValid={isFormValid}
      />

      <OrderModal visible={confirmVisible} onClose={handleCloseConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
  },
  totalPrice: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  orderButton: {
    backgroundColor: '#CDE589',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    width: 200,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
});
