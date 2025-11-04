# HotelBooking

## Project Structure

```
src/
├── components/           # Reusable UI components
├── constants/            # Theme and config (COLORS, SIZES)
├── context/              # Auth and app contexts
├── navigation/           # App, Auth, Main navigators
├── screens/              # auth/, main/, onboarding/
├── services/             # firebase, api, firestore helpers
├── utils/                # helpers and validation
materials/                # design images used in UI
```

## Commands

### Expo (recommended)
- Install deps: `npm install`
- Start dev server: `npx expo start`
- Clear cache: `npx expo start -c`
- iOS simulator (Expo): press `i` in Expo CLI
- Android emulator (Expo): press `a` in Expo CLI
- Web (Expo): press `w` in Expo CLI

### React Native (bare)
- iOS: `npx react-native run-ios`
- Android: `npx react-native run-android`
- Reset Metro cache: `npx react-native start --reset-cache`

### Misc
- Lint (if configured): `npm run lint`
- Format (if configured): `npm run format`
