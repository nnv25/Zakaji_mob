//само меню с карточками блюда
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import DishCard from './DishCard';
import { API_URL } from '@/config/env';

interface Dish {
  _id: string;
  name: string;
  description: string;
  price: number;
  weight: number;
  image: string;
}

interface DishListProps {
  activeCategory: string;
  restaurantId: string;
}

export default function DishList({ activeCategory, restaurantId }: DishListProps) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        let url = `${API_URL}/api/food/all?restaurantId=${restaurantId}`;
        if (activeCategory !== 'Все') {
          url += `&category=${encodeURIComponent(activeCategory)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setDishes(data);
      } catch (error) {
        console.error('Ошибка при загрузке блюд:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [restaurantId, activeCategory]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#CDE589" />
      </View>
    );
  }

  return (
    <FlatList
      data={dishes}
      numColumns={2}
      renderItem={({ item, index }) => (
        <DishCard
          id={item._id}
          title={item.name}
          description={item.description}
          price={item.price}
          weight={`${item.weight} гр.`}
          rating={4.5}
          image={{ uri: item.image }}
          onOrder={() => console.log('Заказано:', item.name)}
          index={index}
        />
      )}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={[
        styles.listContent,
        dishes.length === 0 && styles.emptyList,
      ]}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>В этой категории пока нет блюд</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
  },
  emptyList: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
