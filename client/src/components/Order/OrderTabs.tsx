// табы в заказах
import { usePathname, useRouter, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TabType = 'order' | 'history';

export default function OrderTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams(); // 👈 добавили получение параметров

  const activeTab: TabType = pathname.includes('/Order/history') ? 'history' : 'order';

  const handleTabPress = (tab: TabType) => {
    if (tab === 'order') {
      router.push({
        pathname: '/Order',
        params: {
          restaurantId: params.restaurantId, // 👈 передаём ID ресторана
          restaurantName: params.restaurantName, // 👈 и его имя
        },
      });
    } else {
      router.push({
        pathname: '/Order/history',
        params: {
          restaurantId: params.restaurantId,
          restaurantName: params.restaurantName,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'order' && styles.activeTab]}
          onPress={() => handleTabPress('order')}
        >
          <Text style={[styles.tabText, activeTab === 'order' && styles.activeTabText]}>
            Заказ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => handleTabPress('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            История
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#CDE589',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
});
