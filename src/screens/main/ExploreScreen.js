import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HotelCard from '../../components/HotelCard';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

// Sample hotel data with local images from materials folder
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
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [searchQuery, sortBy, hotels]);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setHotels(SAMPLE_HOTELS);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading hotels:', error);
      Alert.alert('Error', 'Failed to load hotels. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHotels();
    setRefreshing(false);
  };

  const filterAndSortHotels = () => {
    let filtered = [...hotels];

    if (searchQuery.trim()) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        )}
      </View>

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

      <Text style={styles.resultsText}>
        {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
      </Text>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color={COLORS.gray} />
      <Text style={styles.emptyText}>
        {searchQuery ? `No hotels found for "${searchQuery}"` : 'No hotels found'}
      </Text>
      {searchQuery && (
        <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery('')}>
          <Text style={styles.clearButtonText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading hotels...</Text>
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
        contentContainerStyle={filteredHotels.length === 0 ? styles.emptyListContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        removeClippedSubviews
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: SIZES.padding, fontSize: SIZES.body2, color: COLORS.textSecondary },
  listContent: { padding: SIZES.padding },
  emptyListContent: { flexGrow: 1, padding: SIZES.padding },
  header: { marginBottom: SIZES.padding },
  title: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text, marginBottom: SIZES.padding },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: SIZES.radius, paddingHorizontal: SIZES.padding, height: 50, marginBottom: SIZES.padding, ...SHADOWS.light },
  searchInput: { flex: 1, marginLeft: SIZES.base, fontSize: SIZES.body1, color: COLORS.text },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  sortLabel: { fontSize: SIZES.body2, color: COLORS.textSecondary, marginRight: SIZES.base },
  sortButton: { paddingHorizontal: SIZES.padding, paddingVertical: SIZES.base, borderRadius: SIZES.radius, backgroundColor: COLORS.white, marginRight: SIZES.base, borderWidth: 1, borderColor: COLORS.lightGray },
  sortButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortButtonText: { fontSize: SIZES.body2, color: COLORS.textSecondary },
  sortButtonTextActive: { color: COLORS.white, fontWeight: '600' },
  resultsText: { fontSize: SIZES.body3, color: COLORS.textSecondary, marginTop: SIZES.base },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: SIZES.padding * 3 },
  emptyText: { fontSize: SIZES.body1, color: COLORS.textSecondary, marginTop: SIZES.padding, textAlign: 'center' },
  clearButton: { marginTop: SIZES.padding, backgroundColor: COLORS.primary, paddingHorizontal: SIZES.padding * 2, paddingVertical: SIZES.base, borderRadius: SIZES.radius },
  clearButtonText: { color: COLORS.white, fontSize: SIZES.body2, fontWeight: '600' },
});

export default ExploreScreen;
