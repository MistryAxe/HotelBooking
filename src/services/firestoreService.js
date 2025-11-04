import { 
  collection, 
  doc, 
  addDoc,
  getDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  query, 
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ========== BOOKINGS ==========

export const createBooking = async (userId, bookingData) => {
  try {
    const bookingRef = await addDoc(collection(db, 'bookings'), {
      userId: userId,
      hotelId: bookingData.hotelId,
      hotelName: bookingData.hotelName,
      hotelImage: bookingData.hotelImage,
      checkInDate: bookingData.checkInDate,
      checkOutDate: bookingData.checkOutDate,
      numberOfRooms: bookingData.numberOfRooms,
      totalCost: bookingData.totalCost,
      status: 'confirmed',
      createdAt: Timestamp.now(),
      guestName: bookingData.guestName || '',
      guestEmail: bookingData.guestEmail || ''
    });

    return { success: true, bookingId: bookingRef.id };
  } catch (error) {
    console.error('Create booking error:', error);
    return { success: false, error: error.message };
  }
};

// TEMPORARY: Without orderBy until index is ready
export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, 'bookings'), 
      where('userId', '==', userId)
      // Temporarily commented out until index is built
      // orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const bookings = [];
    
    querySnapshot.forEach((doc) => {
      bookings.push({ id: doc.id, ...doc.data() });
    });

    // Sort in JavaScript instead (temporary)
    bookings.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return dateB - dateA;
    });

    return { success: true, bookings };
  } catch (error) {
    console.error('Get bookings error:', error);
    return { success: false, error: error.message };
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'cancelled',
      cancelledAt: Timestamp.now()
    });

    return { success: true };
  } catch (error) {
    console.error('Cancel booking error:', error);
    return { success: false, error: error.message };
  }
};

// ========== REVIEWS ==========

export const createReview = async (userId, reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      userId: userId,
      userName: reviewData.userName,
      hotelId: reviewData.hotelId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: Timestamp.now()
    });

    return { success: true, reviewId: reviewRef.id };
  } catch (error) {
    console.error('Create review error:', error);
    return { success: false, error: error.message };
  }
};

// TEMPORARY: Without orderBy until index is ready
export const getHotelReviews = async (hotelId) => {
  try {
    const q = query(
      collection(db, 'reviews'), 
      where('hotelId', '==', hotelId)
      // Temporarily commented out until index is built
      // orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    // Sort in JavaScript instead (temporary)
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate() || new Date(0);
      const dateB = b.createdAt?.toDate() || new Date(0);
      return dateB - dateA;
    });

    return { success: true, reviews };
  } catch (error) {
    console.error('Get reviews error:', error);
    return { success: false, error: error.message };
  }
};

export const checkUserReview = async (userId, hotelId) => {
  try {
    const q = query(
      collection(db, 'reviews'), 
      where('userId', '==', userId),
      where('hotelId', '==', hotelId)
    );
    
    const querySnapshot = await getDocs(q);
    
    return { success: true, hasReviewed: !querySnapshot.empty };
  } catch (error) {
    console.error('Check review error:', error);
    return { success: false, error: error.message };
  }
};

// ========== HOTELS ==========

export const getHotels = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'hotels'));
    const hotels = [];
    
    querySnapshot.forEach((doc) => {
      hotels.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, hotels };
  } catch (error) {
    console.error('Get hotels error:', error);
    return { success: false, error: error.message };
  }
};

export const getHotelById = async (hotelId) => {
  try {
    const hotelDoc = await getDoc(doc(db, 'hotels', hotelId));
    
    if (hotelDoc.exists()) {
      return { success: true, hotel: { id: hotelDoc.id, ...hotelDoc.data() } };
    } else {
      return { success: false, error: 'Hotel not found' };
    }
  } catch (error) {
    console.error('Get hotel error:', error);
    return { success: false, error: error.message };
  }
};
