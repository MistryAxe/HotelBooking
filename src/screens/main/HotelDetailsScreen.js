import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { COLORS, SIZES } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { fetchWeatherByCoords } from '../../services/apiService';
import { getHotelReviews } from '../../services/firestoreService';

const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    loadWeather();
    loadReviews();
  }, []);

  const loadWeather = async () => {
    if (hotel.latitude && hotel.longitude) {
      const result = await fetchWeatherByCoords(hotel.latitude, hotel.longitude);
      if (result.success) {
        setWeather(result.data);
      }
    }
    setLoadingWeather(false);
  };

  const loadReviews = async () => {
    const result = await getHotelReviews(hotel.id);
    if (result.success) {
      setReviews(result.reviews.slice(0, 3));
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigation.navigate('Auth');
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleBackToExplore = () => {
    // If inside the nested Explore stack, pop back if possible; otherwise navigate to Explore tab root
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Explore');
    }
  };

  const handleViewAllReviews = () => {
    navigation.navigate('Reviews', { hotel });
  };

  const imageSource = typeof hotel.image === 'string' ? { uri: hotel.image } : hotel.image;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={imageSource} 
            style={styles.image} 
            defaultSource={require('../../../materials/10-Hotel Detail Page/image-1.png')}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToExplore}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{hotel.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={18} color={COLORS.primary} />
            <Text style={styles.location}>{hotel.location}</Text>
          </View>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color={COLORS.warning} />
            <Text style={styles.rating}>{hotel.rating}</Text>
            <Text style={styles.reviews}>({hotel.reviews} reviews)</Text>
          </View>

          {loadingWeather ? (
            <View style={styles.weatherContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : weather ? (
            <View style={styles.weatherContainer}>
              <Ionicons name="partly-sunny" size={24} color={COLORS.primary} />
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherTemp}>
                  {Math.round(weather.main.temp)}°C
                </Text>
                <Text style={styles.weatherDesc}>{weather.weather[0].description}</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{hotel.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {hotel.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Reviews</Text>
              {reviews.length > 0 && (
                <TouchableOpacity onPress={handleViewAllReviews}>
                  <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
              )}
            </View>

            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{review.userName}</Text>
                    <View style={styles.reviewRating}>
                      <Ionicons name="star" size={14} color={COLORS.warning} />
                      <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment} numberOfLines={2}>
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Price per night</Text>
              <Text style={styles.price}>${hotel.price}</Text>
            </View>
            <CustomButton
              title="Book Now"
              onPress={handleBookNow}
              style={styles.bookButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 300, backgroundColor: COLORS.lightGray },
  backButton: { position: 'absolute', top: 40, left: SIZES.padding, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SIZES.padding * 2 },
  name: { fontSize: SIZES.h3, color: COLORS.text, marginBottom: SIZES.base, fontWeight: '700' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding },
  location: { fontSize: SIZES.body2, color: COLORS.textSecondary, marginLeft: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.padding },
  rating: { fontSize: SIZES.body1, color: COLORS.text, marginLeft: 5, fontWeight: '600' },
  reviews: { fontSize: SIZES.body3, color: COLORS.textSecondary, marginLeft: 5 },
  weatherContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: SIZES.padding * 2 },
  weatherInfo: { marginLeft: SIZES.padding },
  weatherTemp: { fontSize: SIZES.h5, color: COLORS.text, fontWeight: 'bold' },
  weatherDesc: { fontSize: SIZES.caption, color: COLORS.textSecondary, textTransform: 'capitalize' },
  section: { marginBottom: SIZES.padding * 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.padding },
  sectionTitle: { fontSize: SIZES.h5, color: COLORS.text, fontWeight: '600', marginBottom: SIZES.padding },
  description: { fontSize: SIZES.body2, color: COLORS.textSecondary, lineHeight: 22 },
  amenitiesContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  amenityChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, paddingHorizontal: SIZES.padding, paddingVertical: SIZES.base, borderRadius: SIZES.radius, marginRight: SIZES.base, marginBottom: SIZES.base },
  amenityText: { fontSize: SIZES.caption, color: COLORS.text, marginLeft: 5 },
  viewAllText: { fontSize: SIZES.body2, color: COLORS.primary, fontWeight: '600' },
  reviewCard: { backgroundColor: COLORS.background, padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: SIZES.base },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base },
  reviewUser: { fontSize: SIZES.body2, color: COLORS.text, fontWeight: '600' },
  reviewRating: { flexDirection: 'row', alignItems: 'center' },
  reviewRatingText: { fontSize: SIZES.caption, color: COLORS.text, marginLeft: 3 },
  reviewComment: { fontSize: SIZES.caption, color: COLORS.textSecondary, lineHeight: 18 },
  noReviews: { fontSize: SIZES.body2, color: COLORS.textSecondary, fontStyle: 'italic' },
  footer: { marginTop: SIZES.padding },
  priceSection: { marginBottom: SIZES.padding },
  priceLabel: { fontSize: SIZES.caption, color: COLORS.textSecondary, marginBottom: 5 },
  price: { fontSize: SIZES.h3, color: COLORS.primary, fontWeight: 'bold' },
  bookButton: { width: '100%' },
});

export default HotelDetailsScreen;
