import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, FlatList, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { signOutUser } from '../../services/authService';

const headerImg = require('../../../materials/14-Map Page/image-4.png');
const avatarImg = require('../../../materials/09-Account Page/image-1.png');

const favorites = [
  { id: 'f1', image: require('../../../materials/06-Explore Page/image-1.png'), title: 'Citadines Berawa' },
  { id: 'f2', image: require('../../../materials/06-Explore Page/image-4.png'), title: 'Seminyak Resort' },
];

const ProfileScreen = () => {
  const { user } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={headerImg} style={styles.headerBg}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Account</Text>
          <TouchableOpacity onPress={() => setShowLogout(true)}>
            <Text style={styles.signOutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.avatarWrap}>
          <Image source={avatarImg} style={styles.avatar} />
        </View>
      </ImageBackground>

      <View style={styles.card}>
        <Text style={styles.name}>{user?.displayName || 'Nirmala Azalea'}</Text>
        <Text style={styles.email}>{user?.email || 'nirmala@gmail.com'}</Text>

        <View style={styles.progressCard}>
          <Image source={avatarImg} style={styles.progressEmoji} />
          <View style={{ flex: 1 }}>
            <Text style={styles.progressText}>Complete your profile to get more discounts</Text>
            <TouchableOpacity style={styles.completeBtn}><Text style={styles.completeBtnText}>Complete Now</Text></TouchableOpacity>
          </View>
          <View style={styles.progressBadge}><Text style={styles.progressBadgeText}>75%</Text></View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}><Text style={styles.statNum}>12</Text><Text style={styles.statLabel}>Staycation Visited</Text></View>
          <View style={styles.stat}><Text style={styles.statNum}>10</Text><Text style={styles.statLabel}>Reviews Given</Text></View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Favourite</Text>
        <FlatList
          data={favorites}
          horizontal
          keyExtractor={(i) => i.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.favItem}>
              <Image source={item.image} style={styles.favImg} />
            </View>
          )}
        />
      </View>

      <Modal visible={showLogout} transparent animationType="slide" onRequestClose={() => setShowLogout(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sign out</Text>
            <Text style={styles.modalBody}>Are you sure you want to sign out?</Text>
            <TouchableOpacity style={styles.dangerBtn} onPress={async () => { await signOutUser(); }}>
              <Text style={styles.dangerBtnText}>Sign out Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogout(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerBg: { height: 160, paddingHorizontal: SIZES.padding, paddingTop: SIZES.padding },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: SIZES.h3, fontWeight: '700' },
  signOutText: { color: COLORS.white, fontSize: SIZES.body2 },
  avatarWrap: { position: 'absolute', bottom: -30, left: SIZES.padding },
  avatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: COLORS.white },
  card: { backgroundColor: COLORS.white, marginTop: 40, marginHorizontal: SIZES.padding, borderRadius: SIZES.radius, padding: SIZES.padding, ...SHADOWS.light },
  name: { fontSize: SIZES.h3, color: COLORS.text, fontWeight: '700' },
  email: { fontSize: SIZES.body2, color: COLORS.gray, marginBottom: SIZES.padding },
  progressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: SIZES.radius, padding: SIZES.padding, marginBottom: SIZES.padding },
  progressEmoji: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  progressText: { fontSize: SIZES.body2, color: COLORS.text, marginBottom: 6 },
  completeBtn: { alignSelf: 'flex-start', backgroundColor: COLORS.white, borderRadius: SIZES.radius, paddingHorizontal: 12, paddingVertical: 6, ...SHADOWS.light },
  completeBtnText: { color: COLORS.primary, fontWeight: '600' },
  progressBadge: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.light },
  progressBadgeText: { color: COLORS.gray, fontWeight: '700' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.padding },
  stat: { alignItems: 'center', flex: 1 },
  statNum: { fontSize: SIZES.h3, color: COLORS.text, fontWeight: '700' },
  statLabel: { fontSize: SIZES.caption, color: COLORS.textSecondary },
  section: { marginTop: SIZES.padding, paddingHorizontal: SIZES.padding },
  sectionTitle: { fontSize: SIZES.h4, color: COLORS.text, marginBottom: SIZES.base, fontWeight: '600' },
  favItem: { width: 140, height: 84, marginRight: 12, borderRadius: SIZES.radius, overflow: 'hidden', backgroundColor: COLORS.lightGray },
  favImg: { width: '100%', height: '100%' },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, alignItems: 'center', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: COLORS.white, width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: SIZES.padding * 2 },
  modalTitle: { fontSize: SIZES.h4, color: COLORS.text, fontWeight: '700', marginBottom: 8 },
  modalBody: { fontSize: SIZES.body2, color: COLORS.textSecondary, marginBottom: SIZES.padding },
  dangerBtn: { backgroundColor: COLORS.error, borderRadius: SIZES.radius, alignItems: 'center', paddingVertical: 12, marginBottom: 10 },
  dangerBtnText: { color: COLORS.white, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 10 },
  cancelBtnText: { color: COLORS.primary, fontWeight: '600' }
});

export default ProfileScreen;
