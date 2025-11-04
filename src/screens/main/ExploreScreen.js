import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HotelCard from '../../components/HotelCard';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const SAMPLE_HOTELS = [
  { id: '1', name: 'Grand Plaza Hotel', location: 'New York, USA', rating: 4.8, reviews: 256, price: 250, image: require('../../../materials/06-Explore Page/image-1.png'), latitude: 40.7589, longitude: -73.9851, description: 'Luxury hotel in the heart of Manhattan with stunning city views and world-class amenities', amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Parking'] },
  { id: '2', name: 'Seaside Resort', location: 'Miami Beach, USA', rating: 4.6, reviews: 189, price: 180, image: require('../../../materials/06-Explore Page/image-4.png'), latitude: 25.7907, longitude: -80.1300, description: 'Beautiful beachfront resort with ocean views and private beach access', amenities: ['WiFi', 'Beach Access', 'Pool', 'Bar', 'Water Sports'] },
  { id: '3', name: 'Mountain Lodge', location: 'Aspen, Colorado', rating: 4.9, reviews: 312, price: 320, image: require('../../../materials/06-Explore Page/image-13.png'), latitude: 39.1911, longitude: -106.8175, description: 'Cozy lodge with stunning mountain views and direct ski slope access', amenities: ['WiFi', 'Fireplace', 'Ski Access', 'Restaurant', 'Spa'] },
  { id: '4', name: 'Urban Boutique Hotel', location: 'San Francisco, USA', rating: 4.7, reviews: 203, price: 210, image: require('../../../materials/06-Explore Page/image-14.png'), latitude: 37.7749, longitude: -122.4194, description: 'Stylish boutique hotel in downtown SF with modern design and rooftop bar', amenities: ['WiFi', 'Rooftop Bar', 'Gym', 'Parking', 'Business Center'] },
  { id: '5', name: 'Luxury Resort & Spa', location: 'Los Angeles, USA', rating: 4.8, reviews: 445, price: 380, image: require('../../../materials/10-Hotel Detail Page/image-1.png'), latitude: 34.0522, longitude: -118.2437, description: 'Five-star resort with premium spa facilities and gourmet dining', amenities: ['WiFi', 'Spa', 'Pool', 'Restaurant', 'Valet', 'Concierge'] },
];

const ExploreScreen = ({ navigation, route }) => {
  const presetQuery = route?.params?.presetQuery ?? '';
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(presetQuery);
  const [sortBy, setSortBy] = useState('rating');
  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => { loadHotels(); }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      filterAndSortHotels();
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, sortBy, hotels]);

  useEffect(() => {
    if (route?.params?.presetQuery !== undefined) {
      setSearchQuery(route.params.presetQuery);
    }
  }, [route?.params?.presetQuery]);

  const loadHotels = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        setHotels(SAMPLE_HOTELS);
        setLoading(false);
      }, 200);
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
    const q = searchQuery.trim().toLowerCase();
    if (q.length > 0) {
      filtered = filtered.filter(hotel =>
        hotel.name.toLowerCase().includes(q) ||
        hotel.location.toLowerCase().includes(q)
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Explore Hotels</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.mapBtn}>
          <Ionicons name="map-outline" size={22} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={COLORS.gray}
          autoCapitalize="none"
          autoCorrect={false}
          importantForAutofill="no"
          accessibilityLabel="Search hotels or locations"
          accessibilityHint="Type a hotel name or a location"
          enterKeyHint="search"
          returnKeyType="search"
          blurOnSubmit={false}
          onSubmitEditing={() => filterAndSortHotels()}
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
          <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>Rating</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
          onPress={() => setSortBy('price')}
        >
          <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>Price</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.resultsText}>
        {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''} found
      </Text>
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
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <FlatList
          data={filteredHotels}
          renderItem={({ item }) => (
            <HotelCard hotel={item} onPress={() => handleHotelPress(item)} />
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={filteredHotels.length === 0 ? styles.emptyListContent : styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          removeClippedSubviews
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={10}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SIZES.base },
  mapBtn: { padding: SIZES.base, borderRadius: SIZES.radius, backgroundColor: COLORS.white, ...SHADOWS.light },
  title: { fontSize: SIZES.h1, fontWeight: 'bold', color: COLORS.text },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: SIZES.radius, paddingHorizontal: SIZES.padding, height: 50, marginTop: SIZES.base, marginBottom: SIZES.padding, ...SHADOWS.light },
  searchInput: { flex: 1, marginLeft: SIZES.base, fontSize: SIZES.body1, color: COLORS.text },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  sortLabel: { fontSize: SIZES.body2, color: COLORS.textSecondary, marginRight: SIZES.base },
  sortButton: { paddingHorizontal: SIZES.padding, paddingVertical: SIZES.base, borderRadius: SIZES.radius, backgroundColor: COLORS.white, marginRight: SIZES.base, borderWidth: 1, borderColor: COLORS.lightGray },
  sortButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortButtonText: { fontSize: SIZES.body2, color: COLORS.textSecondary },
  sortButtonTextActive: { color: COLORS.white, fontWeight: '600' },
  resultsText: { fontSize: SIZES.body3, color: COLORS.textSecondary, marginTop: SIZES.base },
});

export default ExploreScreen;
