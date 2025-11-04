import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

const HotelCard = ({ hotel, onPress }) => {
  // Handle both local (require) and remote (uri) images
  const imageSource = typeof hotel.image === 'string' 
    ? { uri: hotel.image }
    : hotel.image;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image 
        source={imageSource} 
        style={styles.image}
        defaultSource={{ uri: 'https://via.placeholder.com/300x200?text=Hotel+Image' }}
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>{hotel.location}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.rating} />
            <Text style={styles.rating}>{hotel.rating}</Text>
            <Text style={styles.reviews}>({hotel.reviews} reviews)</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>${hotel.price}</Text>
            <Text style={styles.perNight}>/night</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.cardRadius,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
    resizeMode: 'cover',
  },
  content: {
    padding: SIZES.padding,
  },
  name: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  location: {
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
    marginLeft: 5,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: SIZES.body2,
    color: COLORS.text,
    marginLeft: 5,
    fontWeight: '600',
  },
  reviews: {
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: SIZES.h3,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  perNight: {
    fontSize: SIZES.body3,
    color: COLORS.textSecondary,
  },
});

export default HotelCard;