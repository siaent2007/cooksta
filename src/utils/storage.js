import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  USER: '@cooksta_user',
  FAVORITES: '@cooksta_favorites',
  THEME: '@cooksta_theme',
  NOTIF_ENABLED: '@cooksta_notif_enabled',
  NOTIF_TIME: '@cooksta_notif_time',
};

export async function saveData(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function loadData(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    // Corrupted JSON or storage read failure — treat as no value instead of throwing.
    console.warn(`Failed to load "${key}" from storage:`, err);
    return null;
  }
}

export async function removeData(key) {
  await AsyncStorage.removeItem(key);
}
