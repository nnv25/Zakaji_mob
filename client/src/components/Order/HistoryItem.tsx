// src/components/history/HistoryItem.tsx
import React, { memo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { HistoryDish, HistoryOrder } from '../data/orderHistory';

type Props = { order: HistoryOrder };

function formatDate(iso: string) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return { date: `${dd}.${mm}.${yyyy}`, time: `${hh}:${min}:${ss}` };
}

const DishRow = memo(({ dish }: { dish: HistoryDish }) => (
    <View style={styles.dishRow}>
        <Image source={dish.image} style={styles.dishImage} />
        <View style={{ flex: 1 }}>
            <Text style={styles.dishTitle}>{dish.title}</Text>
            <Text style={styles.dishWeight}>{dish.weight}</Text>
        </View>
        <Text style={styles.dishPrice}>₽ {dish.price.toFixed(2)}</Text>
    </View>
));



export default function HistoryItem({ order }: Props) {
    const [open, setOpen] = useState<boolean>(order.items.length > 0); // первый можно сразу открыть, если есть позиции
    const dt = formatDate(order.dateISO);

    return (
        <View style={styles.card}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen((v) => !v)} style={styles.header}>
                <Image source={order.restaurantLogo} style={styles.logo} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{order.restaurantTitle}</Text>
                    <Text style={styles.subtitle}>{order.itemsCount} позиции</Text>
                    <Text style={styles.total}>₽ {order.total.toFixed(2)}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.date}>{dt.date}</Text>
                    <Text style={styles.date}>{dt.time}</Text>
                </View>
            </TouchableOpacity>

            {open && order.items.length > 0 && (
                <View style={styles.details}>
                    {order.items.map((dish) => (
                        <DishRow key={dish.id} dish={dish} />
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    header: { flexDirection: 'row', alignItems: 'center' },
    logo: { width: 56, height: 56, resizeMode: 'contain', marginRight: 12 },
    title: { fontSize: 18, fontWeight: '700', color: '#111' },
    subtitle: { fontSize: 14, color: '#777', marginTop: 2, marginBottom: 4 },
    total: { fontSize: 18, fontWeight: '700', color: '#111' },
    date: { fontSize: 13, color: '#B2B2B2' },

    details: { marginTop: 12, gap: 10 },
    dishRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 14,
        padding: 10,
    },
    dishImage: { width: 96, height: 64, borderRadius: 12, marginRight: 12 },
    dishTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
    dishWeight: { fontSize: 14, color: '#777', marginTop: 4 },
    dishPrice: { fontSize: 18, fontWeight: '700', color: '#111' },
});