//карточка ресторана на главной
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 3; 

export default function RestaurantCard({ _id, name, rating, reviews, hours, image }) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: '/Menu',
      params: { restaurantId: _id, restaurantName: name },
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.top}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="star" color="#F5B800" size={14} />
          <Text style={styles.rating}>
            {rating} ({reviews})
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" color="#555" size={14} />
          <Text style={styles.hours} numberOfLines={1}>{hours}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    //flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    //marginHorizontal: 6,
    width: (width - 40) / 3,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  top: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  name: {
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 3,
    textAlign: 'center',
    lineHeight: 14,
    minHeight: 28,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 10,
    color: '#777',
    marginLeft: 4,
  },
  hours: {
    fontSize: 11,
    color: '#777',
    marginLeft: 4,
    flexShrink: 1,
  },
});