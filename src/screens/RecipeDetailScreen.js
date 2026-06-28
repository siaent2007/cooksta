import React, { useEffect, useState, useMemo } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Linking, Share,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { getMealById, extractIngredients } from '../services/mealApi';

const TABS = ['Ingredients', 'Steps', 'About'];

export default function RecipeDetailScreen({ route }) {
  const { mealId }                       = route.params;
  const { theme: t }                     = useTheme();
  const { isFavorite, toggleFavorite }   = useFavorites();
  const s = useMemo(() => styles(t), [t]);

  const [meal, setMeal]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('Ingredients');

  useEffect(() => {
    getMealById(mealId).then((data) => { setMeal(data); setLoading(false); });
  }, [mealId]);

  if (loading) return (
    <View style={s.center}><ActivityIndicator size="large" color={t.accent} /></View>
  );
  if (!meal) return (
    <View style={s.center}><Text style={s.errText}>Recipe not found.</Text></View>
  );

  const ingredients = extractIngredients(meal);
  const fav         = isFavorite(meal.idMeal);
  const steps       = (meal.strInstructions ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const handleShare = () =>
    Share.share({ message: `Check out "${meal.strMeal}" on Cooksta! 🍽️` });

  return (
    <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={s.imageWrap}>
        <Image source={{ uri: meal.strMealThumb }} style={s.image} />
        <View style={s.imageActions}>
          <TouchableOpacity style={s.iconBtn} onPress={() => toggleFavorite(meal)}>
            <Text style={{ fontSize: 22 }}>{fav ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={handleShare}>
            <Text style={{ fontSize: 20 }}>📤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.body}>
        <Text style={s.title}>{meal.strMeal}</Text>
        {meal.strArea ? (
          <View style={s.badge}><Text style={s.badgeText}>{meal.strArea}</Text></View>
        ) : null}

        {/* Tabs */}
        <View style={s.tabRow}>
          {TABS.map((tab_) => (
            <TouchableOpacity
              key={tab_}
              style={[s.tabBtn, tab === tab_ && s.tabBtnActive]}
              onPress={() => setTab(tab_)}
            >
              <Text style={[s.tabLabel, tab === tab_ && s.tabLabelActive]}>{tab_}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ingredients tab */}
        {tab === 'Ingredients' && ingredients.map((item, i) => (
          <View key={i} style={s.ingRow}>
            <Text style={s.ingName}>{item.ingredient}</Text>
            <Text style={s.ingMeasure}>{item.measure}</Text>
          </View>
        ))}

        {/* Steps tab */}
        {tab === 'Steps' && steps.map((step, i) => (
          <View key={i} style={s.stepRow}>
            <View style={s.stepBadge}><Text style={s.stepNum}>{i + 1}</Text></View>
            <Text style={s.stepText}>{step}</Text>
          </View>
        ))}

        {/* About tab */}
        {tab === 'About' && (
          <View>
            {[['Cuisine', meal.strArea], ['Category', meal.strCategory], ['Tags', meal.strTags]].map(([label, val]) => (
              <View key={label} style={s.aboutRow}>
                <Text style={s.aboutLabel}>{label}</Text>
                <Text style={s.aboutVal}>{val || '—'}</Text>
              </View>
            ))}
            {meal.strYoutube ? (
              <TouchableOpacity style={s.ytBtn} onPress={() => Linking.openURL(meal.strYoutube)}>
                <Text style={s.ytBtnText}>▶  Watch on YouTube</Text>
              </TouchableOpacity>
            ) : null}
            {meal.strSource ? (
              <TouchableOpacity style={s.srcBtn} onPress={() => Linking.openURL(meal.strSource)}>
                <Text style={s.srcBtnText}>🔗  View Source Recipe</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = (t) => StyleSheet.create({
  scroll:    { flex: 1, backgroundColor: t.bg },
  center:    { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: t.bg },
  errText:   { color: t.danger, fontSize: 16 },
  imageWrap: { position: 'relative' },
  image:     { width: '100%', height: 270, resizeMode: 'cover' },
  imageActions: {
    position: 'absolute', bottom: 12, right: 14,
    flexDirection: 'row', gap: 10,
  },
  iconBtn: {
    backgroundColor: 'rgba(0,0,0,0.52)', borderRadius: 24,
    width: 46, height: 46, alignItems: 'center', justifyContent: 'center',
  },
  body:          { padding: 20 },
  title:         { fontSize: 24, fontWeight: '800', color: t.text, marginBottom: 8 },
  badge: {
    alignSelf: 'flex-start', backgroundColor: t.accent,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, marginBottom: 20,
  },
  badgeText:     { color: '#fff', fontSize: 12, fontWeight: '700' },
  tabRow:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: t.border, marginBottom: 20 },
  tabBtn:        { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabBtnActive:  { borderBottomWidth: 2, borderBottomColor: t.accent },
  tabLabel:      { fontSize: 14, fontWeight: '600', color: t.textSub },
  tabLabelActive:{ color: t.accent },
  ingRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: t.border,
  },
  ingName:       { color: t.text, fontSize: 14, flex: 1 },
  ingMeasure:    { color: t.accent, fontSize: 14, fontWeight: '600' },
  stepRow:       { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  stepBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center',
    marginRight: 12, marginTop: 1, flexShrink: 0,
  },
  stepNum:       { color: '#fff', fontWeight: '700', fontSize: 13 },
  stepText:      { color: t.text, fontSize: 14, lineHeight: 22, flex: 1 },
  aboutRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: t.border,
  },
  aboutLabel:    { color: t.textSub, fontSize: 14 },
  aboutVal:      { color: t.text, fontSize: 14, fontWeight: '600' },
  ytBtn: {
    backgroundColor: '#ff0000', borderRadius: 12,
    paddingVertical: 14, alignItems: 'center', marginTop: 22,
  },
  ytBtnText:     { color: '#fff', fontWeight: '700', fontSize: 15 },
  srcBtn: {
    backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 10,
  },
  srcBtnText:    { color: t.accent, fontWeight: '700', fontSize: 15 },
});
