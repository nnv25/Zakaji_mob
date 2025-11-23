// src/components/history/HistoryList.tsx
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryItem from './HistoryItem';
import { API_URL } from '@/config/env';

export default function HistoryList() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const savedUser = await AsyncStorage.getItem('user');
                if (!savedUser) {
                    setOrders([]);
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(savedUser);
                const res = await fetch(`${API_URL}/api/orders/user/${user._id}`);
                const data = await res.json();

                if (res.ok) {
                    setOrders(data);
                } else {
                    console.error('Ошибка загрузки истории:', data.message);
                    setOrders([]);
                }
            } catch (error) {
                console.error('Ошибка при загрузке истории:', error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        loadHistory();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#CDE589" />
            </View>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>История заказов пуста</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <HistoryItem
                        order={{
                            id: item._id,
                            restaurantTitle: item.restaurant?.name || 'Неизвестный ресторан',
                            restaurantLogo: { uri: item.restaurant?.image },
                            itemsCount: item.items.length,
                            total: item.totalPrice,
                            dateISO: item.createdAt,
                            items: item.items.map((dish) => ({
                                id: dish._id,
                                title: dish.title,
                                weight: dish.weight || '',
                                price: dish.price,
                                image: { uri: dish.image }, // ✅ dish.image уже абсолютный путь
                            })),
                        }}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 16, paddingTop: 8 },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: { textAlign: 'center', color: '#999', marginTop: 32, fontSize: 16 },
});
