import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HotelCard from '../../components/HotelCard';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

// Sample hotel data with actual images from materials folder
const SAMPLE_HOTELS = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'New York, USA',
    rating: 4.8,
    reviews: 256,
    price: 250,
    image: require('../../../materials/06-Explore Page/image-1.png'),
    description: 'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities',
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'],
    latitude: 40.7589,
    longitude: -73.9851,
  },
  {
    id: '2',
    name: 'Seaside Resort',
    location: 'Miami Beach, USA',
    rating: 4.6,
    reviews: 189,
    price: 180,
    image: require('../../../materials/06-Explore Page/image-4.png'),
    description: 'Beautiful beachfront resort with ocean views and private beach access',
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Bar', 'Water Sports'],
    latitude: 25.7907,
    longitude: -80.1300,
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Aspen, Colorado',
    rating: 4.9,
    reviews: 312,
    price: 320,
    image: require('../../../materials/06-Explore Page/image-13.png'),
    description: 'Cozy lodge with stunning mountain views and direct ski slope access',
    amenities: ['WiFi', 'Fireplace', 'Ski Access', 'Restaurant', 'Spa'],
    latitude: 39.1911,
    longitude: -106.8175,
  },
  {
    id: '4',
    name: 'Urban Boutique Hotel',
    location: 'San Francisco, USA',
    rating: 4.7,
    reviews: 203,
    price: 210,
    image: require('../../../materials/06-Explore Page/image-14.png'),
    description: 'Stylish boutique hotel in downtown SF with modern design and rooftop bar',
    amenities: ['WiFi', 'Rooftop Bar', 'Gym', 'Parking', 'Business Center'],
    latitude: 37.7749,
    longitude: -122.4194,
  },
  {
    id: '5',
    name: 'Luxury Resort & Spa',
    location: 'Los Angeles, USA',
    rating: 4.8,
    reviews: 445,
    price: 380,
    image: require('../../../materials/10-Hotel Detail Page/image-1.png'),
    description: 'Five-star resort with premium spa facilities and gourmet dining',
    amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Valet', 'Concierge'],
    latitude: 34.0522,
    longitude: -118.2437,
  },
];

const ExploreScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating'); // rating, price

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [searchQuery, sortBy, hotels]);

  const loadHotels = async () => {
    setLoading(true);
    // In production, fetch from Firebase
    // const result = await getHotels();
    setTimeout(() => {
      setHotels(SAMPLE_HOTELS);
      setLoading(false);
    }, 1000);
  };

  const filterAndSortHotels = () => {
    let filtered = [...hotels];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredHotels(filtered);
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Explore Hotels</Text>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.gray}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>
            Rating
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
            Price
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredHotels}
        renderItem={({ item }) => (
          <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hotels found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SIZES.padding,
  },
  header: {
    marginBottom: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 50,
    marginBottom: SIZES.padding,
  },
  searchInput: {
    flex: 1,
    marginLeft: SIZES.base,
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginRight: SIZES.base,
  },
  sortButton: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
    marginRight: SIZES.base,
  },
  sortButtonActive: {
    backgroundColor: COLORS.primary,
  },
  sortButtonText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  sortButtonTextActive: {
    color: COLORS.white,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 3,
  },
  emptyText: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
});

export default ExploreScreen;
