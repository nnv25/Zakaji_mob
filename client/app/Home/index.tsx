import Header from '@/components/Home/Header';
import SearchInput from "@/components/Home/SearchInput";
import Banner from "@/components/Home/Banner";
import Tabs from "@/components/Home/Tab";
import RestaurantCard from "@/components/Home/RestaurantCard";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from "react";
import { API_URL } from '@/config/env';
import SideMenu from '../SideMenu/SideMenu';

export default function Home() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async (query = '') => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/restaurant/all?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setRestaurants(data);
    } catch (error) {
      console.error('Ошибка при загрузке ресторанов:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (searchQuery === "") {
      fetchRestaurants();
    } else {
      fetchRestaurants(searchQuery);
    }
  }, [searchQuery]);


  useEffect(() => {
    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#CDE589" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <Header onMenuPress={() => setMenuVisible(true)} />
        <SearchInput onSearch={setSearchQuery} />
        <Banner />
        <Tabs activeTab={activeTab} onChange={setActiveTab} />
      </View>
      {restaurants.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#777' }}>Ничего не найдено</Text>
        </View>
      ) : (
        <FlatList
          data={restaurants}
          numColumns={3}
          renderItem={({ item }) => (
            <RestaurantCard
              _id={item._id}
              name={item.name}
              rating={4.8}
              reviews={163}
              hours={`${item.worktime.weekdays}`}
              image={{ uri: item.image }}
            />
          )}
          keyExtractor={(item) => item._id.toString()}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
        />
      )}
      {/* БОКОВОЕ МЕНЮ */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingBottom: 10 },
  flatList: { marginTop: 10 },
  tabs: { flexDirection: 'row', marginBottom: 12 },
  tab: {
    fontSize: 12,
    color: '#777',
    marginRight: 16,
    paddingBottom: 4,
    paddingLeft: 10,
  },
  activeTab: { color: '#000', borderBottomWidth: 2, borderBottomColor: '#CDE589' },
  columnWrapper: { justifyContent: 'space-between' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
});