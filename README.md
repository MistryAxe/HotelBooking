# Hotel Booking App

A comprehensive React Native hotel booking application with Firebase backend integration, featuring search, booking management, reviews, and maps.

## Features

### 🏨 Core Functionality
- **Hotel Search & Exploration** - Browse and search hotels by name or location
- **Detailed Hotel View** - View hotel details, amenities, weather, and reviews
- **Booking Management** - Make reservations, edit bookings, and cancel bookings
- **User Reviews** - Read and write hotel reviews with star ratings
- **Interactive Map** - View hotel locations with custom pin markers
- **User Profiles** - Manage profile, view statistics, and favorites

### 🔐 Authentication
- Firebase Email/Password authentication
- User registration and login
- Password reset functionality
- Secure session management

### 📱 UI/UX Features
- Responsive design with Material UI principles
- Smooth navigation with React Navigation
- Image optimization using local assets
- Pull-to-refresh functionality
- Keyboard-friendly inputs with debouncing
- Loading states and error handling

## Tech Stack

- **Frontend:** React Native 0.81.5
- **Navigation:** React Navigation 6
- **Backend:** Firebase (Authentication & Firestore)
- **APIs:** OpenWeatherMap for weather data
- **State Management:** React Hooks + Context API
- **Storage:** AsyncStorage for preferences

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CustomButton.js
│   ├── CustomInput.js
│   ├── HotelCard.js
│   └── ReviewCard.js
├── constants/            # Theme and configuration
│   └── theme.js
├── context/              # React Context providers
│   └── AuthContext.js
├── navigation/           # Navigation structure
│   ├── AppNavigator.js
│   ├── AuthNavigator.js
│   └── MainNavigator.js
├── screens/              # Application screens
│   ├── auth/            # Authentication screens
│   ├── main/            # Main app screens
│   └── onboarding/      # Onboarding flow
├── services/            # API and backend services
│   ├── apiService.js
│   ├── authService.js
│   ├── firestoreService.js
│   └── dealsService.js
└── utils/               # Utility functions
    └── diagnostics.js
```

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MistryAxe/HotelBooking.git
   cd HotelBooking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Update `src/config/firebase.js` with your Firebase config

4. **Set up OpenWeatherMap API:**
   - Get API key from [OpenWeatherMap](https://openweathermap.org/api)
   - Update `src/services/apiService.js` with your API key

## Running the App

### Development Mode
```bash
npm start
# or
yarn start
```

### Platform-specific
```bash
# iOS
npm run ios
# or
yarn ios

# Android
npm run android
# or
yarn android
```

## Key Screens

### Authentication Flow
- **Onboarding** - First-time user introduction
- **Sign In/Up** - User authentication with validation
- **Forgot Password** - Password recovery

### Main Application
- **Explore** - Hotel listings with search and filtering
- **Hotel Details** - Comprehensive hotel information with weather
- **Booking** - Date selection and reservation management
- **Reviews** - Read and write hotel reviews
- **Map** - Interactive hotel location map
- **Profile** - User account and preferences management
- **My Bookings** - View and manage reservations

## Features in Detail

### 🔍 Search & Filtering
- Real-time search with debounced input
- Sort by rating or price
- Location-based filtering
- Pull-to-refresh data updates

### 📅 Booking Management
- Date validation (check-out after check-in)
- Guest count selection
- Booking confirmation
- Edit existing bookings
- Cancel reservations with confirmation

### ⭐ Review System
- 5-star rating system
- Text reviews with validation
- Aggregate rating display
- User review history
- Dummy reviews for demonstration

### 🗺️ Map Integration
- Custom map with hotel pins
- Location-based search
- Visual hotel distribution
- Navigation between map and listings

## Firebase Collections

### Users
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  createdAt: timestamp
}
```

### Bookings
```javascript
{
  id: string,
  userId: string,
  hotelId: string,
  checkIn: date,
  checkOut: date,
  guests: number,
  totalPrice: number,
  status: 'active' | 'cancelled',
  createdAt: timestamp
}
```

### Reviews
```javascript
{
  id: string,
  userId: string,
  hotelId: string,
  userName: string,
  rating: number,
  comment: string,
  createdAt: timestamp
}
```

## Material Assets

The app uses organized visual assets from the `materials/` directory:

- **06-Explore Page/** - Hotel thumbnail images
- **09-Account Page/** - User avatars and profile images
- **10-Hotel Detail Page/** - Hotel detail images
- **11-Select Room Page/** - Room selection visuals
- **12-Booking Success Page/** - Confirmation graphics
- **13-All Reviews Page/** - Review-related imagery
- **14-Map Page/** - Map backgrounds and UI elements
- **15-Search Page/** - Search interface graphics and icons

## Development Notes

### Performance Optimizations
- FlatList with `removeClippedSubviews` for large datasets
- Image caching with proper source handling
- Debounced search input (250ms delay)
- Optimized re-renders with useMemo and useCallback

### Error Handling
- Network request error boundaries
- Authentication failure handling
- Image loading fallbacks
- Form validation with user feedback

### Testing
Run the diagnostics utility to validate theme constants and environment:
```javascript
import { runCompleteCheck } from './src/utils/diagnostics';
runCompleteCheck();
```

## Troubleshooting

### Common Issues
1. **Images not loading** - Ensure materials folder images exist at specified paths
2. **Navigation errors** - Check that all screens are properly registered in navigators
3. **Firebase errors** - Verify Firebase configuration and API keys
4. **Build failures** - Clear cache with `npx react-native start --reset-cache`

### Dependencies
Key dependencies include:
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`
- `react-native-safe-area-context`
- `@react-native-async-storage/async-storage`
- `firebase`
- `axios`
- `@expo/vector-icons`

## License

This project is for educational purposes as part of DSW02B1 Development Software 2B coursework.

## Author

MistryAxe - Hotel Booking App Assignment
