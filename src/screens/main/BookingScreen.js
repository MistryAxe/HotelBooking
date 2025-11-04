import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { createBooking } from '../../services/firestoreService';
import { validateDates, calculateNights, formatDate } from '../../utils/validation';

const BookingScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  );
  const [numberOfRooms, setNumberOfRooms] = useState('1');
  const [guestName, setGuestName] = useState(user?.displayName || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const nights = calculateNights(checkInDate, checkOutDate);
  const rooms = parseInt(numberOfRooms) || 1;
  const totalCost = hotel.price * nights * rooms;

  const handleCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckInDate(selectedDate);
      
      // If check-out is before or same as check-in, adjust it
      if (checkOutDate <= selectedDate) {
        const newCheckOut = new Date(selectedDate);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOutDate(newCheckOut);
      }
    }
  };

  const handleCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const incrementRooms = () => {
    const current = parseInt(numberOfRooms) || 1;
    if (current < 10) {
      setNumberOfRooms((current + 1).toString());
    }
  };

  const decrementRooms = () => {
    const current = parseInt(numberOfRooms) || 1;
    if (current > 1) {
      setNumberOfRooms((current - 1).toString());
    }
  };

  const handleBooking = async () => {
    // Validate dates
    const dateValidation = validateDates(checkInDate, checkOutDate);
    if (!dateValidation.valid) {
      Alert.alert('Invalid Dates', dateValidation.error);
      return;
    }

    // Validate guest info
    if (!guestName.trim()) {
      Alert.alert('Error', 'Please enter guest name');
      return;
    }

    if (!guestEmail.trim()) {
      Alert.alert('Error', 'Please enter guest email');
      return;
    }

    // Confirm booking
    Alert.alert(
      'Confirm Booking',
      `You are about to book ${rooms} room(s) for ${nights} night(s).\n\nTotal: $${totalCost}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: confirmBooking },
      ]
    );
  };

  const confirmBooking = async () => {
    setLoading(true);

    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      numberOfRooms: rooms,
      totalCost: totalCost,
      guestName: guestName,
      guestEmail: guestEmail,
    };

    const result = await createBooking(user.uid, bookingData);
    setLoading(false);

    if (result.success) {
      navigation.navigate('BookingSuccess', {
        booking: { ...bookingData, id: result.bookingId },
      });
    } else {
      Alert.alert('Booking Failed', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Hotel</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hotel Info */}
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          <Text style={styles.hotelPrice}>${hotel.price} per night</Text>
        </View>

        {/* Check-in Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Check-in Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {showCheckInPicker && (
          <DateTimePicker
            value={checkInDate}
            mode="date"
            display="default"
            onChange={handleCheckInChange}
            minimumDate={new Date()}
          />
        )}

        {/* Check-out Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Check-out Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutDate}
            mode="date"
            display="default"
            onChange={handleCheckOutChange}
            minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
          />
        )}

        {/* Number of Rooms */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Rooms</Text>
          <View style={styles.roomSelector}>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={decrementRooms}
              disabled={rooms <= 1}
            >
              <Ionicons
                name="remove-circle"
                size={32}
                color={rooms <= 1 ? COLORS.disabled : COLORS.primary}
              />
            </TouchableOpacity>
            <Text style={styles.roomCount}>{numberOfRooms}</Text>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={incrementRooms}
              disabled={rooms >= 10}
            >
              <Ionicons
                name="add-circle"
                size={32}
                color={rooms >= 10 ? COLORS.disabled : COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Guest Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Guest Information</Text>
          <CustomInput
            label="Full Name"
            placeholder="Enter guest name"
            value={guestName}
            onChangeText={setGuestName}
            icon="person-outline"
          />
          <CustomInput
            label="Email"
            placeholder="Enter guest email"
            value={guestEmail}
            onChangeText={setGuestEmail}
            keyboardType="email-address"
            icon="mail-outline"
          />
        </View>

        {/* Booking Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Duration</Text>
            <Text style={styles.summaryValue}>{nights} night(s)</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rooms</Text>
            <Text style={styles.summaryValue}>{rooms} room(s)</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per night</Text>
            <Text style={styles.summaryValue}>${hotel.price}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Cost</Text>
            <Text style={styles.totalValue}>${totalCost}</Text>
          </View>
        </View>

        {/* Book Button */}
        <CustomButton
          title="Confirm Booking"
          onPress={handleBooking}
          loading={loading}
          style={styles.bookButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  headerTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  hotelInfo: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
  },
  hotelName: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 5,
  },
  hotelLocation: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  hotelPrice: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  label: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    flex: 1,
    ...FONTS.body,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base,
  },
  roomSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
  },
  roomButton: {
    padding: SIZES.base,
  },
  roomCount: {
    ...FONTS.h3,
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.padding * 2,
    minWidth: 50,
    textAlign: 'center',
  },
  sectionTitle: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.padding,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding * 2,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding * 2,
  },
  summaryTitle: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.padding,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.base,
  },
  summaryLabel: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.padding,
  },
  totalLabel: {
    ...FONTS.h6,
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  totalValue: {
    ...FONTS.h6,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  bookButton: {
    marginBottom: SIZES.padding,
  },
});

export default BookingScreen;
