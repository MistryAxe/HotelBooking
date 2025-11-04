import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { getHotelReviews, createReview } from '../../services/firestoreService';

const avatar1 = require('../../../materials/09-Account Page/avatar.png');
const thumb1 = require('../../../materials/06-Explore Page/image-1.png');
const thumb2 = require('../../../materials/06-Explore Page/image-4.png');

const seed = (hotelId) => ([
  { id: 'd1', userName: 'Rakabuming Suhu', rating: 5, comment: 'Amazing stay. Great service and location!', createdAt: new Date(), avatar: avatar1, images: [thumb1] },
  { id: 'd2', userName: 'Cameron Williamson', rating: 4, comment: 'Clean rooms and nice breakfast.', createdAt: new Date(), avatar: avatar1, images: [thumb2] },
]);

const ReviewsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const res = await getHotelReviews(hotel.id);
    let list = [];
    if (res.success) list = res.reviews.map(r => ({ ...r, avatar: avatar1 }));
    // seed dummies if none
    if (!list || list.length === 0) list = seed(hotel.id);
    setReviews(list);
    setLoading(false);
  };

  const add = async () => {
    if (!user) return Alert.alert('Login required', 'Please sign in to add a review.');
    if (!comment.trim()) return Alert.alert('Error', 'Please write a comment');
    setSubmitting(true);
    const payload = { hotelId: hotel.id, userName: user.displayName || 'Anonymous', rating, comment: comment.trim() };
    const res = await createReview(user.uid, payload);
    setSubmitting(false);
    if (!res.success) return Alert.alert('Error', res.error || 'Failed to submit');
    setModalVisible(false);
    setComment(''); setRating(5);
    load();
  };

  const Header = () => {
    const avg = reviews.length ? (reviews.reduce((a, r) => a + (r.rating || 0), 0) / reviews.length).toFixed(1) : '0.0';
    return (
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
        <View style={styles.aggregate}> 
          <Text style={styles.aggregateNum}>{avg}</Text>
          <View style={{ flexDirection: 'row', marginLeft: 4 }}>
            {[1,2,3,4,5].map(i => (
              <Ionicons key={i} name={i <= Math.round(avg) ? 'star' : 'star-outline'} size={14} color={COLORS.rating} />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const Item = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={item.avatar || avatar1} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.user}>{item.userName}</Text>
          <View style={{ flexDirection: 'row' }}>{[1,2,3,4,5].map(i => (<Ionicons key={i} name={i <= (item.rating||0) ? 'star' : 'star-outline'} size={14} color={COLORS.rating} />))}</View>
        </View>
        <Text style={styles.date}>{new Date(item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt).toLocaleDateString()}</Text>
      </View>
      {item.images && item.images.length > 0 && (
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          {item.images.map((img, idx) => (<Image key={idx} source={img} style={styles.thumb} />))}
        </View>
      )}
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {user && (
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={22} color={COLORS.primary} />
          <Text style={styles.addText}>Write a Review</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={reviews}
        keyExtractor={(i, idx) => i.id || String(idx)}
        renderItem={Item}
        contentContainerStyle={{ padding: SIZES.padding }}
      />

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Write a Review</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: SIZES.padding }}>
              {[1,2,3,4,5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} style={{ marginHorizontal: 6 }}>
                  <Ionicons name={i <= rating ? 'star' : 'star-outline'} size={28} color={COLORS.rating} />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.input}
              placeholder="Share your experience..."
              placeholderTextColor={COLORS.gray}
              value={comment}
              onChangeText={setComment}
              multiline numberOfLines={6}
              textAlignVertical="top"
            />
            <TouchableOpacity style={[styles.primaryBtn, submitting && { opacity: 0.6 }]} onPress={add} disabled={submitting}>
              <Text style={styles.primaryBtnText}>{submitting ? 'Submitting...' : 'Submit Review'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SIZES.padding, paddingTop: 8 },
  headerTitle: { fontSize: SIZES.h4, color: COLORS.text, fontWeight: '700' },
  aggregate: { position: 'absolute', right: SIZES.padding, top: SIZES.padding },
  aggregateNum: { fontSize: SIZES.h5, color: COLORS.text, fontWeight: '700' },
  addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, marginTop: SIZES.base },
  addText: { marginLeft: 8, color: COLORS.primary, fontWeight: '600' },
  card: { backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.base, marginHorizontal: SIZES.padding, ...SHADOWS.light },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  user: { fontSize: SIZES.body2, color: COLORS.text, fontWeight: '600' },
  date: { fontSize: SIZES.caption, color: COLORS.textSecondary },
  comment: { marginTop: 8, color: COLORS.textSecondary, fontSize: SIZES.body2 },
  thumb: { width: 64, height: 48, borderRadius: 8, marginRight: 8 },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.white, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: SIZES.padding * 2 },
  modalTitle: { fontSize: SIZES.h4, color: COLORS.text, fontWeight: '700', marginBottom: SIZES.base },
  input: { backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: SIZES.padding, color: COLORS.text, minHeight: 120 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: SIZES.radius, alignItems: 'center', paddingVertical: 12, marginTop: SIZES.base },
  primaryBtnText: { color: COLORS.white, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: COLORS.primary, fontWeight: '600' },
});

export default ReviewsScreen;
