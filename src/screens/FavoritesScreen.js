import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

export default function FavoritesScreen({ navigation }) {
  const { theme: t }               = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const s = useMemo(() => styles(t), [t]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={s.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })}
    >
      <Image source={{ uri: item.strMealThumb }} style={s.thumb} />
      <View style={s.cardBody}>
        <Text style={s.cardTitle} numberOfLines={2}>{item.strMeal}</Text>
        {item.strArea ? (
          <View style={s.tag}><Text style={s.tagText}>{item.strArea}</Text></View>
        ) : null}
      </View>
      <TouchableOpacity style={s.heartBtn} onPress={() => toggleFavorite(item)}>
        <Text style={{ fontSize: 22 }}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.container}>
        <Text style={s.heading}>Saved recipes</Text>
        <Text style={s.count}>{favorites.length} saved</Text>

        {favorites.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🤍</Text>
            <Text style={s.emptyTitle}>No saved recipes yet</Text>
            <Text style={s.emptySub}>Tap the heart on any recipe to save it here.</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.idMeal}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = (t) => StyleSheet.create({
  safe:       { flex: 1, backgroundColor: t.bg },
  container:  { flex: 1, padding: 16 },
  heading:    { fontSize: 22, fontWeight: '800', color: t.text, marginBottom: 2 },
  count:      { fontSize: 13, color: t.textSub, marginBottom: 16 },
  card: {
    backgroundColor: t.card, borderRadius: 14, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', overflow: 'hidden',
  },
  thumb:      { width: 80, height: 80 },
  cardBody:   { flex: 1, padding: 12 },
  cardTitle:  { fontSize: 14, fontWeight: '700', color: t.text, marginBottom: 6 },
  tag: {
    alignSelf: 'flex-start', backgroundColor: t.accent,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  tagText:    { color: '#fff', fontSize: 11, fontWeight: '600' },
  heartBtn:   { padding: 14 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon:  { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: t.text },
  emptySub:   { fontSize: 13, color: t.textSub, marginTop: 6, textAlign: 'center', paddingHorizontal: 30 },
});
