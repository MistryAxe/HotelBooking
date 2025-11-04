import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const markers = [
  { id: 'm1', top: 160, left: 60, label: 'Grand Plaza', query: 'New York' },
  { id: 'm2', top: 220, left: 140, label: 'Seaside', query: 'Miami' },
  { id: 'm3', top: 190, left: 230, label: 'Boutique', query: 'San Francisco' },
];

const MapScreen = ({ navigation }) => {
  const mapSource = useMemo(() => require('../../../materials/14-Map Page/image-4.png'), []);
  const pinSource = useMemo(() => require('../../../materials/15-Search Page/map-pin.png'), []);

  const handleMarkerPress = (marker) => {
    navigation.navigate('ExploreScreen', { presetQuery: marker.query });
  };

  const handleBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Explore');
  };

  const handleExploreArea = () => {
    navigation.navigate('ExploreScreen', { presetQuery: '' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.title}>Map</Text>
          <View style={{ width: 40 }} />
        </View>

        <ImageBackground source={mapSource} style={styles.map} resizeMode="cover">
          {markers.map((m) => (
            <TouchableOpacity key={m.id} style={[styles.marker, { top: m.top, left: m.left }]} onPress={() => handleMarkerPress(m)}>
              <Image source={pinSource} style={styles.pin} />
              <Text style={styles.markerLabel}>{m.label}</Text>
            </TouchableOpacity>
          ))}
        </ImageBackground>

        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.ctaBtn} onPress={handleExploreArea}>
            <Ionicons name="search" size={18} color={COLORS.white} />
            <Text style={styles.ctaText}>Explore this area</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingTop: SIZES.base, marginBottom: SIZES.base },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.overlay, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', color: COLORS.text, fontSize: SIZES.h3, fontWeight: '700' },
  map: { flex: 1 },
  marker: { position: 'absolute', alignItems: 'center' },
  pin: { width: 22, height: 22, marginBottom: 2 },
  markerLabel: { fontSize: SIZES.caption, color: COLORS.text, backgroundColor: COLORS.white, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, ...SHADOWS.light },
  bottomBar: { padding: SIZES.padding },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, height: 48, borderRadius: SIZES.radius },
  ctaText: { color: COLORS.white, fontSize: SIZES.body2, marginLeft: 8, fontWeight: '600' },
});

export default MapScreen;
