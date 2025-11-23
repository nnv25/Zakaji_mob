{/*import { Stack } from 'expo-router';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home/index" />
        <Stack.Screen name="Menu/index" />
      </Stack>
    </CartProvider>
  );
}*/}
import { Stack } from 'expo-router';
import { CartProvider } from '@/context/CartContext';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { API_URL } from '@/config/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Настройка поведения уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const notificationListener = useRef();
  const responseListener = useRef();
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        saveTokenToBackend(token);
      }
    });

    // Получение уведомлений, когда приложение открыто
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        console.log("📩 Получено уведомление:", notification);
      });

    // Обработка кликов по уведомлениям
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log("👆 Пользователь кликнул по уведомлению:", response);

        const data = response?.notification?.request?.content?.data;

        if (data?.orderId) {
          // TODO: открыть страницу заказа
          console.log("Открыть заказ:", data.orderId);
        }
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(notificationListener.current);
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home/index" />
        <Stack.Screen name="Menu/index" />
      </Stack>
    </CartProvider>
  );
}

/** --------------------------------------------------------
 * 👇     ПОЛУЧЕНИЕ PUSH TOKEN (iOS + Android)
 * -------------------------------------------------------- */
async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn("❌ Нет разрешения на уведомления");
    return null;
  }

  // Получение токена
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("📱 Expo Push Token:", token);

  // Android: канал уведомлений
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FFFFFF',
    });
  }

  return token;
}

/** --------------------------------------------------------
 * 👇     ОТПРАВКА ТОКЕНА НА BACKEND
 * -------------------------------------------------------- */
async function saveTokenToBackend(token) {
  try {
    const savedUser = await AsyncStorage.getItem('user');
    if (!savedUser) return;

    const user = JSON.parse(savedUser);

    await fetch(`${API_URL}/api/users/push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        expoPushToken: token,
      }),
    });

    console.log("✅ Токен отправлен на backend");
  } catch (err) {
    console.log("❌ Ошибка отправки токена:", err);
  }
}
