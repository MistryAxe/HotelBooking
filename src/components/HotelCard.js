import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';

const HotelCard = ({ hotel, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: hotel.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>{hotel.location}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
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
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    ...SHADOWS.medium,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.lightGray,
  },
  content: {
    padding: SIZES.padding,
  },
  name: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  location: {
    ...FONTS.caption,
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
    ...FONTS.body,
    color: COLORS.textPrimary,
    marginLeft: 5,
    fontWeight: '600',
  },
  reviews: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    ...FONTS.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  perNight: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
});

export default HotelCard;
