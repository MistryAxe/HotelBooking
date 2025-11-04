import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import {
  getHotelReviews,
  createReview,
  checkUserReview,
} from '../../services/firestoreService';

const ReviewsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    checkIfUserReviewed();
  }, []);

  const loadReviews = async () => {
    const result = await getHotelReviews(hotel.id);
    if (result.success) {
      setReviews(result.reviews);
    }
    setLoading(false);
  };

  const checkIfUserReviewed = async () => {
    if (user) {
      const result = await checkUserReview(user.uid, hotel.id);
      if (result.success) {
        setHasReviewed(result.hasReviewed);
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      Alert.alert('Error', 'Please write a comment');
      return;
    }

    setSubmitting(true);

    const reviewData = {
      hotelId: hotel.id,
      userName: user.displayName || 'Anonymous',
      rating: rating,
      comment: comment.trim(),
    };

    const result = await createReview(user.uid, reviewData);
    setSubmitting(false);

    if (result.success) {
      Alert.alert('Success', 'Review submitted successfully!');
      setModalVisible(false);
      setComment('');
      setRating(5);
      setHasReviewed(true);
      loadReviews();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderStars = (rating, size = 16) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={COLORS.warning}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={COLORS.white} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.userName}</Text>
            {renderStars(item.rating, 14)}
          </View>
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item.createdAt.toDate()).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Hotel Info */}
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color={COLORS.warning} />
          <Text style={styles.rating}>{hotel.rating}</Text>
          <Text style={styles.reviewCount}>({reviews.length} reviews)</Text>
        </View>
      </View>

      {/* Add Review Button */}
      {!hasReviewed && user && (
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          <Text style={styles.addReviewText}>Write a Review</Text>
        </TouchableOpacity>
      )}

      {/* Reviews List */}
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyText}>No reviews yet</Text>
            <Text style={styles.emptySubtext}>Be the first to review!</Text>
          </View>
        }
      />

      {/* Add Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Write a Review</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Star Rating Selector */}
            <View style={styles.ratingSelector}>
              <Text style={styles.ratingLabel}>Your Rating</Text>
              <View style={styles.starsSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={star <= rating ? 'star' : 'star-outline'}
                      size={32}
                      color={COLORS.warning}
                      style={styles.starButton}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Comment Input */}
            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Your Review</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor={COLORS.gray}
              />
            </View>

            {/* Submit Button */}
            <CustomButton
              title="Submit Review"
              onPress={handleSubmitReview}
              loading={submitting}
              style={styles.submitButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding,
  },
  headerTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  hotelInfo: {
    paddingHorizontal: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  hotelName: {
    ...FONTS.h5,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...FONTS.h6,
    color: COLORS.textPrimary,
    marginLeft: 5,
    fontWeight: '600',
  },
  reviewCount: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SIZES.padding * 2,
    marginBottom: SIZES.padding,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addReviewText: {
    ...FONTS.body,
    color: COLORS.primary,
    marginLeft: SIZES.base,
    fontWeight: '600',
  },
  listContent: {
    padding: SIZES.padding * 2,
    paddingTop: 0,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: SIZES.base,
    flex: 1,
  },
  userName: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: 3,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  reviewDate: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  reviewComment: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.radius * 2,
    borderTopRightRadius: SIZES.radius * 2,
    padding: SIZES.padding * 2,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  modalTitle: {
    ...FONTS.h4,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  ratingSelector: {
    marginBottom: SIZES.padding * 2,
  },
  ratingLabel: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  starsSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    marginHorizontal: 5,
  },
  commentSection: {
    marginBottom: SIZES.padding * 2,
  },
  commentLabel: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginBottom: SIZES.base,
  },
  commentInput: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...FONTS.body,
    color: COLORS.textPrimary,
    height: 120,
  },
  submitButton: {
    marginBottom: SIZES.padding,
  },
});

export default ReviewsScreen;
