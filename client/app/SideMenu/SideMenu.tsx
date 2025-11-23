import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

export default function SideMenu({ visible, onClose }: SideMenuProps) {
    const router = useRouter();
    const params = useLocalSearchParams();

    const slideAnim = useRef(new Animated.Value(-320)).current;

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const user = await AsyncStorage.getItem("user");
        setIsLogged(!!user);
    };

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -320,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    const goTo = (path: string, extraParams: any = {}) => {
        onClose();
        router.push({ pathname: path, params: extraParams });
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("phone");
        await AsyncStorage.removeItem("name");
        setIsLogged(false);
        onClose();
    };

    const openWhatsApp = () => {
        const phone = "79141090001"; // номер без символов
        const message = encodeURIComponent('Пишу из приложения "Закажи"');
        const url = `https://wa.me/${phone}?text=${message}`;

        Linking.openURL(url).catch(() => {
            alert("Не удалось открыть WhatsApp");
        });
    };

    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <Animated.View style={[styles.menuContainer, { transform: [{ translateX: slideAnim }] }]}>

                {/* Фон логотипа */}
                <Image
                    source={require('../../assets/images/leftlogo.png')}
                    style={styles.logoBackground}
                    resizeMode="contain"
                />

                {/* Кнопка закрытия */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={26} color="#000" />
                </TouchableOpacity>

                {/* Навигация */}
                <View style={styles.links}>

                    {/* Главная */}
                    <TouchableOpacity
                        onPress={() => goTo('/Home')}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>Главная</Text>
                    </TouchableOpacity>

                    {/* Связаться (WhatsApp) */}
                    <TouchableOpacity
                        onPress={openWhatsApp}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>Связаться</Text>
                    </TouchableOpacity>

                    {/* Настройки */}
                    <TouchableOpacity
                        onPress={() => goTo('/Settings')}
                        style={styles.link}
                    >
                        <Text style={styles.linkText}>Настройки</Text>
                    </TouchableOpacity>

                </View>

                {/* Авторизация */}
                <View style={styles.bottomArea}>
                    {!isLogged ? (
                        <TouchableOpacity onPress={() => goTo('/auth')} style={styles.loginButton}>
                            <Text style={styles.loginText}>Войти</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                            <Text style={styles.logoutText}>Выйти</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <BlurView intensity={20} tint="light" style={styles.blurRight} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
        zIndex: 999,
    },
    menuContainer: {
        width: '75%',
        height: '100%',
        backgroundColor: '#C6E583',
        paddingHorizontal: 30,
        paddingTop: 40,
    },
    logoBackground: {
        position: 'absolute',
        left: -20,
        bottom: 0,
        width: 260,
        height: '100%',
        opacity: 0.23,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 10,
    },
    links: {
        marginTop: 120,
        gap: 25,
    },
    link: {
        paddingVertical: 8,
    },
    linkText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    bottomArea: {
        position: 'absolute',
        bottom: 60,
        left: 30,
        right: 30,
    },
    loginButton: {
        paddingVertical: 10,
    },
    loginText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    logoutButton: {
        paddingVertical: 10,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF3B30',
    },
    blurRight: {
        position: 'absolute',
        right: -20,
        width: 60,
        height: '100%',
    },
});