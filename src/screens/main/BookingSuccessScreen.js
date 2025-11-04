import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { formatDate } from '../../utils/validation';

const BookingSuccessScreen = ({ route, navigation }) => {
  const { booking } = route.params;

  const handleViewBookings = () => {
    navigation.navigate('Main', { 
      screen: 'MyBookings'
    });
  };

  const handleBackToExplore = () => {
    navigation.navigate('Main', {
      screen: 'Explore'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={120} color={COLORS.success} />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your hotel reservation has been successfully confirmed
        </Text>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Hotel</Text>
              <Text style={styles.detailValue}>{booking.hotelName}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Check-in</Text>
              <Text style={styles.detailValue}>
                {formatDate(booking.checkInDate)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Check-out</Text>
              <Text style={styles.detailValue}>
                {formatDate(booking.checkOutDate)}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="bed-outline" size={20} color={COLORS.primary} />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Rooms</Text>
              <Text style={styles.detailValue}>
                {booking.numberOfRooms} room(s)
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>${booking.totalCost}</Text>
          </View>
        </View>

        {/* Confirmation Note */}
        <View style={styles.noteCard}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.info} />
          <Text style={styles.noteText}>
            A confirmation email has been sent to {booking.guestEmail}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <CustomButton
          title="View My Bookings"
          onPress={handleViewBookings}
          style={styles.button}
        />
        <CustomButton
          title="Back to Explore"
          onPress={handleBackToExplore}
          variant="outline"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding * 2,
    paddingTop: SIZES.padding * 2,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.base,
  },
  subtitle: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.padding * 3,
    lineHeight: 22,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
  },
  cardTitle: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.padding,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  detailText: {
    marginLeft: SIZES.padding,
    flex: 1,
  },
  detailLabel: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 3,
  },
  detailValue: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.padding,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    ...FONTS.h6,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  totalValue: {
    ...FONTS.h5,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '10',
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  noteText: {
    ...FONTS.caption,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    padding: SIZES.padding * 2,
  },
  button: {
    marginBottom: SIZES.padding,
  },
});

export default BookingSuccessScreen;
