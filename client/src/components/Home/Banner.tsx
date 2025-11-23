// Баннер главной страницы
import React, { useState, useRef, useEffect } from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { API_URL } from '@/config/env';

const { width } = Dimensions.get('window');

export default function Banner() {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [banners, setBanners] = useState([]);

  // 🧠 Получение баннеров с сервера
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_URL}/api/banners/all`);
        const data = await res.json();

        // собираем массив из трёх баннеров, исключая пустые
        const arr = [data.banner1, data.banner2, data.banner3].filter(Boolean);
        setBanners(arr);
      } catch (error) {
        console.error("Ошибка загрузки баннеров:", error);
      }
    };

    fetchBanners();
  }, []);

  // ⏱️ Автопрокрутка каждые 3 секунды
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      const nextIndex = (index + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: width * nextIndex, animated: true });
      setIndex(nextIndex);
    }, 3000);
    return () => clearInterval(timer);
  }, [index, banners]);

  // 🔄 При ручном свайпе
  const onScroll = (e) => {
    const slide = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(slide);
  };

  if (banners.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {banners.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Индикаторы */}
      <View style={styles.dots}>
        {banners.map((_, i) => (
          <View key={i} style={[styles.dot, index === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 10 },
  image: {
    width,
    height: 150,
    borderRadius: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#CDE589",
  },
});