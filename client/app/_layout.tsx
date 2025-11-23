import { Stack } from 'expo-router';
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
}