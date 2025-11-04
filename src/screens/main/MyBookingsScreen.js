import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getUserBookings, cancelBooking } from '../../services/firestoreService';
import { formatDate } from '../../utils/validation';

const MyBookingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (user) {
      const result = await getUserBookings(user.uid);
      if (result.success) {
        setBookings(result.bookings);
      }
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadBookings();
  };

  const handleCancelBooking = (bookingId, hotelName) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${hotelName}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => confirmCancel(bookingId) },
      ]
    );
  };

  const confirmCancel = async (bookingId) => {
    const result = await cancelBooking(bookingId);
    if (result.success) {
      Alert.alert('Success', 'Booking cancelled successfully');
      loadBookings();
    } else {
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      case 'completed':
        return COLORS.info;
      default:
        return COLORS.gray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'cancelled':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      default:
        return 'time';
    }
  };

  const renderBookingCard = ({ item }) => {
    const checkInDate = new Date(item.checkInDate);
    const isPast = checkInDate < new Date();
    const canCancel = item.status === 'confirmed' && !isPast;

    return (
      <View style={styles.bookingCard}>
        <Image source={{ uri: item.hotelImage }} style={styles.hotelImage} />
        
        <View style={styles.bookingContent}>
          {/* Hotel Name */}
          <Text style={styles.hotelName} numberOfLines={1}>
            {item.hotelName}
          </Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <Ionicons
              name={getStatusIcon(item.status)}
              size={14}
              color={getStatusColor(item.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>

          {/* Dates */}
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {formatDate(item.checkInDate)} - {formatDate(item.checkOutDate)}
            </Text>
          </View>

          {/* Rooms */}
          <View style={styles.detailRow}>
            <Ionicons name="bed-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText}>
              {item.numberOfRooms} room(s)
            </Text>
          </View>

          {/* Total Cost */}
          <View style={styles.footer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>${item.totalCost}</Text>
          </View>

          {/* Cancel Button */}
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelBooking(item.id, item.hotelName)}
            >
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>Start exploring and book your perfect hotel!</Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Explore')}
            >
              <Text style={styles.exploreButtonText}>Explore Hotels</Text>
            </TouchableOpacity>
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
  header: {
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
  },
  listContent: {
    padding: SIZES.padding * 2,
    paddingTop: SIZES.padding,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  hotelImage: {
    width: '100%',
    height: 150,
    backgroundColor: COLORS.lightGray,
  },
  bookingContent: {
    padding: SIZES.padding,
  },
  hotelName: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.base,
    paddingVertical: 5,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  statusText: {
    ...FONTS.caption,
    marginLeft: 5,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  detailText: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SIZES.base,
    paddingTop: SIZES.padding,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  totalLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  totalAmount: {
    ...FONTS.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: SIZES.padding,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.error,
    alignItems: 'center',
  },
  cancelButtonText: {
    ...FONTS.body,
    color: COLORS.error,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.padding * 4,
  },
  emptyText: {
    ...FONTS.h6,
    color: COLORS.textSecondary,
    marginTop: SIZES.padding,
  },
  emptySubtext: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 5,
    textAlign: 'center',
  },
  exploreButton: {
    marginTop: SIZES.padding * 2,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  exploreButtonText: {
    ...FONTS.body,
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default MyBookingsScreen;
