import axios from 'axios';

const FAKE_STORE_API = 'https://fakestoreapi.com/products?limit=8';

export const fetchDeals = async () => {
  try {
    const { data } = await axios.get(FAKE_STORE_API);
    // Map Fake Store products to hotel-like cards
    const deals = data.map((p) => ({
      id: `deal-${p.id}`,
      name: p.title,
      location: 'Special Deal',
      rating: Math.min(5, Math.max(3, Math.round(p.rating?.rate || 4))),
      reviews: p.rating?.count || 100,
      price: Math.max(60, Math.round(p.price)),
      // Fallback to materials search image if image missing
      image: p.image || require('../materials/15-Search Page/image-1.png'),
      description: p.description,
      amenities: ['WiFi', 'Breakfast', 'Free Cancellation'],
      latitude: 40.7589,
      longitude: -73.9851,
    }));
    return { success: true, deals };
  } catch (error) {
    console.error('Deals fetch error:', error.message);
    return { success: false, error: 'Failed to load deals' };
  }
};
