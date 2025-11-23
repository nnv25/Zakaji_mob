//категории в меню
import React, { useCallback, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from '@/config/env';

interface CategoryTabsProps {
  restaurantId: string;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryTabs({
  restaurantId,
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  const [categories, setCategories] = useState<string[]>(["Все"]);
  const [loading, setLoading] = useState(false);

  // ✅ Загрузка категорий с сервера
  const fetchCategories = useCallback(async () => {
    if (!restaurantId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/category/${restaurantId}`
      );
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        // если нет категорий — показываем только “Все”
        setCategories(["Все"]);
      } else {
        // если есть — добавляем “Все” в начало списка
        const names = ["Все", ...data.map((c: any) => c.name)];
        setCategories(names);
      }
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      setCategories(["Все"]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  // 🔁 Обновление категорий при каждом открытии меню ресторана
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  if (loading) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <ActivityIndicator size="small" color="#CDE589" style={{ marginLeft: 16 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat}
          style={[styles.tab, activeCategory === cat && styles.activeTab]}
          onPress={() => onCategoryChange(cat)}
        >
          <Text
            style={[styles.tabText, activeCategory === cat && styles.activeText]}
          >
            {cat}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 16,
    height: 40,
  },
  contentContainer: {
    flexGrow: 0,
    alignItems: "flex-start",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#CDE589",
  },
  tabText: {
    fontSize: 16,
    color: "#777",
  },
  activeText: {
    color: "#000",
    fontWeight: "600",
  },
});
