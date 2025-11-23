//Главная страница заказа
import { useCart } from '@/context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderNavbar from '@/components/Order/OrderNavbar'
import OrderTabs from '@/components/Order/OrderTabs'
import OrderForm from '@/components/Order/OrderForm'
import OrderTotal from '@/components/Order/OrderTotal'


export default function OrderScreen() {
    const [tableNumber, setTableNumber] = useState('');
    const [message, setMessage] = useState('');
    const [tableError, setTableError] = useState("");
    const params = useLocalSearchParams();
    const restaurantName = (params.restaurantName as string) || 'Ресторан';
    const restaurantId = params.restaurantId as string;
    const { cartItems, removeFromCart } = useCart();

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            {item.image && <Image source={item.image} style={styles.itemImage} />}
            <View style={styles.itemInfo}>
                <View style={styles.description}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription} numberOfLines={1}>
                        {item.description}
                    </Text>
                    <Text style={styles.quantityText}>×{item.quantity}</Text>
                </View>
                <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>₽ {item.price.toFixed(2)}</Text>
                    <Text style={styles.itemWeight}>{item.weight}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <OrderNavbar restaurantName={restaurantName} restaurantId={restaurantId} />
            <OrderTabs />
            <KeyboardAwareFlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                enableOnAndroid={true}
                extraScrollHeight={Platform.OS === 'ios' ? 180 : 250} // 🔥 увеличиваем высоту прокрутки при открытии клавиатуры
                extraHeight={Platform.OS === 'ios' ? 180 : 250} // 🔥 поднимаем содержимое ещё выше
                keyboardOpeningTime={0} // устраняет задержку
                keyboardShouldPersistTaps="handled" // позволяет тапать на поля при открытой клавиатуре
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Корзина пуста</Text>
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <OrderForm
                            tableNumber={tableNumber}
                            setTableNumber={setTableNumber}
                            message={message}
                            setMessage={setMessage}
                            error={tableError}
                        />
                        <View style={styles.totalSection}>
                            <OrderTotal
                                tableNumber={tableNumber}
                                message={message}
                                setTableError={setTableError}
                            />
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9F9F9' },
    listContent: { paddingHorizontal: 16, paddingBottom: 100 },
    footer: { marginTop: 16 },
    totalSection: {
        marginTop: 8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    itemImage: { width: 99, height: 88, borderRadius: 10, marginRight: 12 },
    itemInfo: { flex: 1 },
    description: { width: 120, display: 'flex', flexDirection: 'row', alignItems: 'center' },
    itemTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#000' },
    itemDescription: { fontSize: 13, color: '#777', marginBottom: 6 },
    quantityText: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 12,
        minWidth: 30,
        textAlign: 'center',
        color: '#000',
    },
    itemBottomRow: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10 },
    itemPrice: { fontSize: 15, fontWeight: '700', color: '#000' },
    itemWeight: { fontSize: 13, color: '#666' },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF5C5C',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    emptyContainer: { paddingVertical: 50, alignItems: 'center' },
    emptyText: { color: '#999', fontSize: 16 },
});
