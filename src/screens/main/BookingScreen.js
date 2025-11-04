import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { createOrUpdateBooking, cancelBookingById } from '../../services/firestoreService';

const ROOMS = [
  { id: 'r1', title: 'Grand Deluxe Double with Private Pool', beds: '1 Double', guests: 2, size: '150m2', price: 305, left: 5 },
  { id: 'r2', title: 'Grand Deluxe Double with Private Pool', beds: '1 Double', guests: 2, size: '150m2', price: 305, left: 5 },
];

const BookingScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [showIn, setShowIn] = useState(false);
  const [showOut, setShowOut] = useState(false);
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / 86400000));
  const total = selectedRoom.price * nights;

  const changeDates = () => { setShowIn(true); };
  const confirmBooking = async () => {
    if (!user) return navigation.navigate('Auth');
    const payload = { userId: user.uid, hotelId: hotel.id, checkIn: checkIn.toISOString(), checkOut: checkOut.toISOString(), guests, totalPrice: total, status: 'active', roomId: selectedRoom.id, createdAt: new Date().toISOString() };
    const res = await createOrUpdateBooking(payload);
    if (!res.success) return Alert.alert('Error', res.error || 'Failed to book');
    navigation.navigate('BookingSuccess', { booking: { ...payload, id: res.id }, hotel });
  };

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.roomTitle}>{item.title}</Text>
        <Text style={styles.meta}>{item.left} rooms left</Text>
        <View style={styles.iconRow}>
          <Ionicons name="bed-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.iconText}>{item.beds}</Text>
          <Ionicons name="people-outline" size={14} color={COLORS.textSecondary} style={{ marginLeft: 10 }} />
          <Text style={styles.iconText}>{item.guests} Guests</Text>
          <Ionicons name="resize-outline" size={14} color={COLORS.textSecondary} style={{ marginLeft: 10 }} />
          <Text style={styles.iconText}>{item.size}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price}</Text>
          <Text style={styles.per}>/ per room per night</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.chooseBtn} onPress={() => setSelectedRoom(item)}>
        <Text style={styles.chooseText}>{selectedRoom?.id === item.id ? 'Chosen' : 'Choose'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.planBar}>
        <View>
          <Text style={styles.planTitle}>Plan to Stay</Text>
          <Text style={styles.planDates}>{checkIn.toDateString()} - {checkOut.toDateString()}, {nights} Night{nights>1?'s':''}</Text>
        </View>
        <TouchableOpacity onPress={changeDates}><Text style={styles.change}>Change</Text></TouchableOpacity>
      </View>

      <FlatList
        data={ROOMS}
        keyExtractor={(i) => i.id}
        renderItem={renderRoom}
        contentContainerStyle={{ padding: SIZES.padding }}
        ListFooterComponent={
          <View style={{ paddingVertical: SIZES.padding }}>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Total</Text><Text style={styles.summaryValue}>${total}</Text></View>
            <TouchableOpacity style={styles.primaryBtn} onPress={confirmBooking}><Text style={styles.primaryText}>Book Now</Text></TouchableOpacity>
          </View>
        }
      />

      {showIn && (
        <DateTimePicker value={checkIn} mode="date" display="default" onChange={(e, d) => { setShowIn(false); if (d) { setCheckIn(d); setShowOut(true); } }} />
      )}
      {showOut && (
        <DateTimePicker value={checkOut} mode="date" display="default" onChange={(e, d) => { setShowOut(false); if (d) setCheckOut(d); }} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  planBar: { backgroundColor: COLORS.primary, padding: SIZES.padding, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planTitle: { color: COLORS.white, fontSize: SIZES.h4, fontWeight: '700' },
  planDates: { color: COLORS.white, fontSize: SIZES.body2, marginTop: 2 },
  change: { color: COLORS.white, fontWeight: '700' },
  roomCard: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.padding, ...SHADOWS.light, flexDirection: 'row', alignItems: 'center' },
  roomTitle: { fontSize: SIZES.body1, color: COLORS.text, fontWeight: '700' },
  meta: { color: COLORS.textSecondary, marginBottom: 4 },
  iconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconText: { fontSize: SIZES.caption, color: COLORS.textSecondary, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: SIZES.h4, color: COLORS.text, fontWeight: '700', marginRight: 6 },
  per: { color: COLORS.textSecondary, fontSize: SIZES.caption },
  chooseBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingHorizontal: 16, paddingVertical: 10, marginLeft: 10 },
  chooseText: { color: COLORS.white, fontWeight: '700' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.base },
  primaryBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: SIZES.radius, alignItems: 'center' },
  primaryText: { color: COLORS.white, fontWeight: '700' },
});

export default BookingScreen;
