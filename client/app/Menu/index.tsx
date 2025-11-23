import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '@/components/Menu/Navbar'
import CategoryTabs from '@/components/Menu/CategoryTabs';
import DishList from '@/components/Menu/DishList';

export default function MenuScreen() {
  const params = useLocalSearchParams();

  const rawName = params.restaurantName;
  const rawId = params.restaurantId;

  const restaurantName = Array.isArray(rawName) ? rawName[0] : rawName;
  const restaurantId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [activeCategory, setActiveCategory] = useState('Все');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <NavBar restaurantName={restaurantName} restaurantId={restaurantId} />
      </View>

      <View style={styles.content}>
        <CategoryTabs
          restaurantId={restaurantId}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <DishList activeCategory={activeCategory} restaurantId={restaurantId} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  content: {
    flex: 1,
  },
});