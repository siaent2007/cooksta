import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { getMealById } from '../services/mealApi';

export default function RecipeListScreen({ route, navigation }) {
  const { recipes = [] } = route.params ?? {};
  const { theme: t }     = useTheme();
  const s = useMemo(() => styles(t), [t]);

  const [list, setList] = useState(recipes);

  useEffect(() => {
    const noArea = recipes.filter((r) => !r.strArea).slice(0, 8);
    if (noArea.length === 0) { setList(recipes); return; }

    Promise.all(noArea.map((r) => getMealById(r.idMeal))).then((details) => {
      const map = {};
      details.filter(Boolean).forEach((d) => { map[d.idMeal] = d.strArea; });
      setList(recipes.map((r) => ({ ...r, strArea: map[r.idMeal] ?? r.strArea ?? '' })));
    });
  }, []);

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
      <Text style={s.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.safe} edges={['bottom']}>
      <View style={s.container}>
        <Text style={s.heading}>Recipes for you</Text>
        <Text style={s.count}>{list.length} recipe{list.length !== 1 ? 's' : ''} found</Text>

        {list.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🍽️</Text>
            <Text style={s.emptyTitle}>No recipes found</Text>
            <Text style={s.emptySub}>Try different ingredients or a different cuisine.</Text>
          </View>
        ) : (
          <FlatList
            data={list}
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
  thumb:      { width: 90, height: 90 },
  cardBody:   { flex: 1, padding: 12 },
  cardTitle:  { fontSize: 15, fontWeight: '700', color: t.text, marginBottom: 6 },
  tag: {
    alignSelf: 'flex-start', backgroundColor: t.accent,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  tagText:    { color: '#fff', fontSize: 11, fontWeight: '600' },
  chevron:    { color: t.textSub, fontSize: 24, paddingRight: 14 },
  empty:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon:  { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: t.text },
  emptySub:   { fontSize: 13, color: t.textSub, marginTop: 6, textAlign: 'center' },
});
