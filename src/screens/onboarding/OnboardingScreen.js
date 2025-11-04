import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import { completeOnboarding } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Discover Amazing Hotels',
    description: 'Browse through thousands of hotels worldwide and find your perfect stay',
    image: require('../../../materials/01-Onboarding Page/Onboarding 1.png'),
  },
  {
    id: '2',
    title: 'Easy Booking Process',
    description: 'Book your favorite hotels with just a few taps. Quick, simple, and secure',
    image: require('../../../materials/01-Onboarding Page/Onboarding 2.png'),
  },
  {
    id: '3',
    title: 'Manage Your Trips',
    description: 'Keep track of all your bookings and reviews in one place',
    image: require('../../../materials/01-Onboarding Page/Onboarding 3.png'),
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const { user, setHasCompletedOnboarding } = useAuth();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = async () => {
    if (user) {
      await completeOnboarding(user.uid);
      setHasCompletedOnboarding(true);
    }
  };

  const handleGetStarted = async () => {
    if (user) {
      await completeOnboarding(user.uid);
      setHasCompletedOnboarding(true);
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
      />

      {renderDots()}

      <View style={styles.footer}>
        {currentIndex === slides.length - 1 ? (
          <CustomButton
            title="Get Started"
            onPress={handleGetStarted}
            style={styles.button}
          />
        ) : (
          <CustomButton
            title="Next"
            onPress={handleNext}
            style={styles.button}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.padding * 2,
  },
  skipButton: {
    padding: SIZES.base,
  },
  skipText: {
    ...FONTS.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
  },
  textContainer: {
    marginTop: SIZES.padding * 2,
    alignItems: 'center',
  },
  title: {
    ...FONTS.h2,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.padding,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SIZES.padding,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.padding * 2,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
    width: 30,
  },
  inactiveDot: {
    backgroundColor: COLORS.lightGray,
  },
  footer: {
    paddingHorizontal: SIZES.padding * 2,
    paddingBottom: SIZES.padding * 2,
  },
  button: {
    width: '100%',
  },
});

export default OnboardingScreen;
