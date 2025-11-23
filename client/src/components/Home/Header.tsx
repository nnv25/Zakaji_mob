//Header главной страницы
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import LogoutModal from '../Modal/LogoutModal';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface HeaderProps {
  onMenuPress: () => void;
}

export default function Header({ onMenuPress }: HeaderProps) {
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [userLogged, setUserLogged] = useState(false); // 🔥 состояние авторизации

  // Проверяем авторизацию при каждом рендере
  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setUserLogged(!!user);
    };
    checkUser();
  }, []);

  // открыть модалку
  const handleOpenLogout = () => {
    if (!userLogged) return; // ❗ если не авторизован — не открываем
    setLogoutVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // закрыть модалку
  const handleCloseLogout = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setLogoutVisible(false));
  };

  // logout → обновляем иконку
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUserLogged(false); // 🔥 обновили состояние
    handleCloseLogout();
  };

  return (
    <View style={styles.container}>
      {/* кнопка меню */}
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="menu-outline" size={28} color="#000" />
      </TouchableOpacity>

      {/* логотип */}
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* иконка профиля */}
      <TouchableOpacity onPress={handleOpenLogout}>
        <Ionicons
          name={userLogged ? 'person-circle-outline' : 'person-outline'} // 🔥 МЕНЯЕТСЯ ИКОНКА
          size={30}
          color="#000"
        />
      </TouchableOpacity>

      {/* модалка выхода */}
      <LogoutModal
        visible={logoutVisible}
        fadeAnim={fadeAnim}
        onClose={handleCloseLogout}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 32,
  },
});
