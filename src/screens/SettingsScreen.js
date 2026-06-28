import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Switch, ScrollView, Modal, Alert, Share, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { saveData, loadData, KEYS } from '../utils/storage';


export default function SettingsScreen({ navigation }) {
  const { theme: t, isDark, toggleTheme } = useTheme();
  const { user, logout, updateName }      = useAuth();
  const { favorites }                     = useFavorites();
  const s = useMemo(() => styles(t), [t]);

  const [editingName, setEditingName]   = useState(false);
  const [nameInput, setNameInput]       = useState(user?.name ?? '');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [notifTime, setNotifTime]       = useState('07:00');
  const [timePicker, setTimePicker]     = useState(false);
  const [tempH, setTempH]               = useState('07');
  const [tempM, setTempM]               = useState('00');

  const initials = (user?.name ?? 'U')
    .split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  useEffect(() => {
    loadData(KEYS.NOTIF_ENABLED).then((v) => { if (v !== null) setNotifEnabled(v); });
    loadData(KEYS.NOTIF_TIME).then((v) => { if (v) setNotifTime(v); });
  }, []);

  const scheduleNotif = async (enabled, time) => {
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!enabled) return;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Enable notifications in your device settings.');
      return;
    }
    const [h, m] = time.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Cooksta 🍽️', body: "Time to plan today's meal!" },
      trigger: { hour: h, minute: m, repeats: true },
    });
  };

  const handleToggleNotif = async (val) => {
    setNotifEnabled(val);
    await saveData(KEYS.NOTIF_ENABLED, val);
    await scheduleNotif(val, notifTime);
  };

  const handleSetTime = async () => {
    const time = `${tempH.padStart(2, '0')}:${tempM.padStart(2, '0')}`;
    setNotifTime(time);
    await saveData(KEYS.NOTIF_TIME, time);
    if (notifEnabled) await scheduleNotif(true, time);
    setTimePicker(false);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    await updateName(nameInput.trim());
    setEditingName(false);
  };

  const handleSignOut = () => {
    // Alert.alert button callbacks don't fire on react-native-web, so use
    // the browser confirm there and the native Alert on devices.
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to sign out?')) {
        logout();
      }
      return;
    }
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: logout },
    ]);
  };

  const Row = ({ icon, label, onPress, right, danger }) => (
    <TouchableOpacity
      style={s.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text style={s.rowIcon}>{icon}</Text>
      <Text style={[s.rowLabel, danger && { color: t.danger }]}>{label}</Text>
      <View style={s.rowRight}>{right}</View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            {editingName ? (
              <View style={s.editRow}>
                <TextInput
                  style={s.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  onSubmitEditing={handleSaveName}
                />
                <TouchableOpacity style={s.saveBtn} onPress={handleSaveName}>
                  <Text style={s.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => { setNameInput(user?.name ?? ''); setEditingName(true); }}>
                <Text style={s.profileName}>{user?.name ?? 'User'} ✏️</Text>
              </TouchableOpacity>
            )}
            <Text style={s.profileEmail}>{user?.email}</Text>
          </View>
        </View>

        <Text style={s.sectionLabel}>PREFERENCES</Text>
        <View style={s.card}>
          <Row
            icon="🌙" label="Dark mode"
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ true: t.accent }}
                thumbColor="#fff"
              />
            }
          />
          <Row
            icon="🔔" label="Meal reminder"
            right={
              <Switch
                value={notifEnabled}
                onValueChange={handleToggleNotif}
                trackColor={{ true: t.accent }}
                thumbColor="#fff"
              />
            }
          />
          {notifEnabled && (
            <Row
              icon="🕐" label="Reminder time"
              onPress={() => {
                const [h, m] = notifTime.split(':');
                setTempH(h); setTempM(m);
                setTimePicker(true);
              }}
              right={<Text style={s.timeVal}>{notifTime}</Text>}
            />
          )}
        </View>

        <Text style={s.sectionLabel}>ACCOUNT</Text>
        <View style={s.card}>
          <Row
            icon="❤️" label="My favorites"
            onPress={() => navigation.navigate('Favorites')}
            right={
              <View style={s.badge}>
                <Text style={s.badgeText}>{favorites.length}</Text>
              </View>
            }
          />
          <Row
            icon="📤" label="Share app"
            onPress={() => Share.share({ message: 'Check out Cooksta — a great recipe discovery app! 🍽️' })}
            right={<Text style={s.chevron}>›</Text>}
          />
          <Row
            icon="🚪" label="Sign out"
            onPress={handleSignOut}
            danger
            right={<Text style={[s.chevron, { color: t.danger }]}>›</Text>}
          />
        </View>

      </ScrollView>

      {/* Time picker modal */}
      <Modal visible={timePicker} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Set reminder time</Text>
            <View style={s.timeRow}>
              <TextInput
                style={s.timeInput}
                value={tempH}
                onChangeText={(v) => setTempH(v.replace(/\D/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
                placeholder="HH"
                placeholderTextColor={t.textSub}
              />
              <Text style={s.timeSep}>:</Text>
              <TextInput
                style={s.timeInput}
                value={tempM}
                onChangeText={(v) => setTempM(v.replace(/\D/g, '').slice(0, 2))}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor={t.textSub}
              />
            </View>
            <TouchableOpacity style={s.confirmBtn} onPress={handleSetTime}>
              <Text style={s.confirmBtnText}>Set time</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTimePicker(false)}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (t) => StyleSheet.create({
  safe:         { flex: 1, backgroundColor: t.bg },
  container:    { padding: 16, paddingBottom: 40 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: t.card, borderRadius: 16, padding: 16, marginBottom: 28,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarText:   { color: '#fff', fontSize: 22, fontWeight: '700' },
  profileName:  { fontSize: 17, fontWeight: '700', color: t.text },
  profileEmail: { fontSize: 13, color: t.textSub, marginTop: 4 },
  editRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: {
    flex: 1, backgroundColor: t.bg, borderWidth: 1, borderColor: t.border,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
    color: t.text, fontSize: 15,
  },
  saveBtn:      { backgroundColor: t.accent, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  saveBtnText:  { color: '#fff', fontWeight: '700', fontSize: 13 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: t.textSub,
    letterSpacing: 1, marginBottom: 8, marginLeft: 4,
  },
  card:         { backgroundColor: t.card, borderRadius: 14, marginBottom: 22, overflow: 'hidden' },
  row: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderBottomWidth: 1, borderBottomColor: t.border,
  },
  rowIcon:      { fontSize: 20, marginRight: 14 },
  rowLabel:     { flex: 1, fontSize: 15, color: t.text },
  rowRight:     { marginLeft: 8 },
  badge: {
    backgroundColor: t.accent, borderRadius: 10,
    minWidth: 24, height: 24, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6,
  },
  badgeText:    { color: '#fff', fontSize: 12, fontWeight: '700' },
  chevron:      { color: t.textSub, fontSize: 24 },
  timeVal:      { color: t.accent, fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: t.card,
    borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 24,
  },
  modalTitle:    { fontSize: 18, fontWeight: '700', color: t.text, textAlign: 'center', marginBottom: 24 },
  timeRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 12, marginBottom: 28,
  },
  timeInput: {
    backgroundColor: t.bg, borderWidth: 1, borderColor: t.border,
    borderRadius: 12, width: 72, paddingVertical: 14,
    textAlign: 'center', color: t.text, fontSize: 30, fontWeight: '700',
  },
  timeSep:       { color: t.text, fontSize: 34, fontWeight: '300' },
  confirmBtn:    { backgroundColor: t.accent, borderRadius: 12, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText:{ color: '#fff', fontWeight: '700', fontSize: 16 },
  cancelText:    { color: t.textSub, textAlign: 'center', marginTop: 16, fontSize: 14 },
});
