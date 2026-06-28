import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Modal, FlatList, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { findRecipes, getRandomMeal } from '../services/mealApi';

const CUISINES = ['Any', 'Italian', 'Chinese', 'Thai', 'Indian', 'British', 'Mexican', 'French', 'Japanese', 'Greek'];
const DIETS    = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Low-Carb'];
const QUICK    = ['Chicken', 'Tomato', 'Onion', 'Garlic', 'Rice', 'Pasta', 'Eggs'];

export default function HomeScreen({ navigation }) {
  const { theme: t } = useTheme();
  const { user }     = useAuth();
  const s = useMemo(() => styles(t), [t]);

  const [inputText, setInputText]         = useState('');
  const [ingredients, setIngredients]     = useState([]);
  const [cuisine, setCuisine]             = useState('Any');
  const [diet, setDiet]                   = useState('None');
  const [cuisineModal, setCuisineModal]   = useState(false);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [loading, setLoading]             = useState(false);
  const [featured, setFeatured]           = useState(null);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => { getRandomMeal().then(setFeatured).catch(() => {}); }, []);

  const addIngredient = (text) => {
    const trimmed = text.trim();
    if (trimmed && !ingredients.map((i) => i.toLowerCase()).includes(trimmed.toLowerCase())) {
      setIngredients((prev) => [...prev, trimmed]);
    }
    setInputText('');
  };

  const removeIngredient = (item) => setIngredients((prev) => prev.filter((i) => i !== item));

  const handleFind = async () => {
    setLoading(true);
    try {
      const results = await findRecipes(ingredients, cuisine);
      navigation.navigate('RecipeList', { recipes: results });
    } finally {
      setLoading(false);
    }
  };

  const filteredCuisines = CUISINES.filter((c) =>
    c.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* Greeting */}
        <View style={s.header}>
          <Text style={s.greetingLine}>{greeting},</Text>
          <Text style={s.greetingName}>{firstName} 👋</Text>
          <Text style={s.greetingSub}>What's in your kitchen today?</Text>
        </View>

        {/* Daily inspiration card */}
        {featured ? (
          <TouchableOpacity
            style={s.featured}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RecipeDetail', { mealId: featured.idMeal })}
          >
            <Image source={{ uri: featured.strMealThumb }} style={s.featuredImg} />
            <View style={s.featuredOverlay}>
              <Text style={s.featuredBadge}>Daily Inspiration ✨</Text>
              <Text style={s.featuredTitle} numberOfLines={2}>{featured.strMeal}</Text>
              {featured.strArea ? (
                <View style={s.areaPill}><Text style={s.areaPillText}>{featured.strArea}</Text></View>
              ) : null}
            </View>
          </TouchableOpacity>
        ) : null}

        {/* Ingredient input */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Add ingredients</Text>
          <View style={s.inputRow}>
            <TextInput
              style={s.input}
              placeholder="e.g. chicken"
              placeholderTextColor={t.textSub}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => addIngredient(inputText)}
              returnKeyType="done"
            />
            <TouchableOpacity style={s.addBtn} onPress={() => addIngredient(inputText)}>
              <Text style={s.addBtnText}>＋</Text>
            </TouchableOpacity>
          </View>

          {ingredients.length > 0 && (
            <View style={s.chips}>
              {ingredients.map((ing) => (
                <TouchableOpacity key={ing} style={s.chipAdded} onPress={() => removeIngredient(ing)}>
                  <Text style={s.chipAddedText}>{ing}</Text>
                  <Text style={s.chipX}> ×</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={s.quickLabel}>Quick add</Text>
          <View style={s.chips}>
            {QUICK.map((item) => {
              const active = ingredients.map((i) => i.toLowerCase()).includes(item.toLowerCase());
              return (
                <TouchableOpacity
                  key={item}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => (active ? removeIngredient(item) : addIngredient(item))}
                >
                  <Text style={[s.chipText, active && s.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Cuisine */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Select cuisine</Text>
          <TouchableOpacity style={s.selector} onPress={() => setCuisineModal(true)}>
            <Text style={s.selectorVal}>{cuisine}</Text>
            <Text style={s.selectorArrow}>▾</Text>
          </TouchableOpacity>
        </View>

        {/* Dietary */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Dietary preference</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[s.chips, { flexWrap: 'nowrap' }]}>
              {DIETS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[s.chip, diet === d && s.chipActive]}
                  onPress={() => setDiet(d)}
                >
                  <Text style={[s.chipText, diet === d && s.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Find Recipes */}
        <TouchableOpacity style={s.findBtn} onPress={handleFind} disabled={loading} activeOpacity={0.85}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={s.findBtnText}>Find Recipes</Text>}
        </TouchableOpacity>

      </ScrollView>

      {/* Cuisine modal */}
      <Modal visible={cuisineModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Select cuisine</Text>
            <TextInput
              style={s.modalSearch}
              placeholder="Search cuisine..."
              placeholderTextColor={t.textSub}
              value={cuisineSearch}
              onChangeText={setCuisineSearch}
            />
            <FlatList
              data={filteredCuisines}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={s.cuisineRow}
                  onPress={() => { setCuisine(item); setCuisineModal(false); setCuisineSearch(''); }}
                >
                  <Text style={[s.cuisineRowText, cuisine === item && s.cuisineRowActive]}>{item}</Text>
                  {cuisine === item && <Text style={{ color: t.accent, fontSize: 18 }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={s.modalConfirm}
              onPress={() => { setCuisineModal(false); setCuisineSearch(''); }}
            >
              <Text style={s.modalConfirmText}>Confirm selection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (t) => StyleSheet.create({
  safe:           { flex: 1, backgroundColor: t.bg },
  container:      { padding: 20, paddingBottom: 40 },
  header:         { marginBottom: 22 },
  greetingLine:   { fontSize: 14, color: t.textSub },
  greetingName:   { fontSize: 26, fontWeight: '800', color: t.text, marginTop: 2 },
  greetingSub:    { fontSize: 13, color: t.textSub, marginTop: 4 },
  featured:       { borderRadius: 16, overflow: 'hidden', height: 190, marginBottom: 26 },
  featuredImg:    { width: '100%', height: '100%', resizeMode: 'cover' },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 14, backgroundColor: 'rgba(0,0,0,0.55)',
  },
  featuredBadge:  { fontSize: 11, color: t.accent, fontWeight: '700', marginBottom: 4 },
  featuredTitle:  { fontSize: 18, fontWeight: '700', color: '#fff' },
  areaPill: {
    alignSelf: 'flex-start', backgroundColor: t.accent,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6,
  },
  areaPillText:   { color: '#fff', fontSize: 11, fontWeight: '600' },
  section:        { marginBottom: 22 },
  sectionTitle:   { fontSize: 15, fontWeight: '700', color: t.text, marginBottom: 10 },
  inputRow:       { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1, backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
    color: t.text, fontSize: 14,
  },
  addBtn: {
    backgroundColor: t.accent, borderRadius: 10,
    width: 48, alignItems: 'center', justifyContent: 'center',
  },
  addBtnText:     { color: '#fff', fontSize: 22, fontWeight: '300' },
  chips:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip:           { backgroundColor: t.chip, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipText:       { color: t.chipText, fontSize: 13 },
  chipActive:     { backgroundColor: t.accent },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  chipAdded: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: t.accentDim, borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: t.accent,
  },
  chipAddedText:  { color: t.accent, fontSize: 13, fontWeight: '600' },
  chipX:          { color: t.accent, fontSize: 16, fontWeight: '700' },
  quickLabel:     { fontSize: 12, color: t.textSub, marginTop: 14, marginBottom: 2 },
  selector: {
    backgroundColor: t.card, borderWidth: 1, borderColor: t.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  selectorVal:    { color: t.text, fontSize: 15 },
  selectorArrow:  { color: t.textSub, fontSize: 20 },
  findBtn: {
    backgroundColor: t.accent, borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', marginTop: 6,
  },
  findBtnText:    { color: '#fff', fontWeight: '700', fontSize: 17 },
  modalOverlay:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: t.card,
    borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 20, maxHeight: '75%',
  },
  modalTitle:       { fontSize: 18, fontWeight: '700', color: t.text, marginBottom: 14 },
  modalSearch: {
    backgroundColor: t.bg, borderWidth: 1, borderColor: t.border,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    color: t.text, marginBottom: 12,
  },
  cuisineRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: t.border,
  },
  cuisineRowText:   { color: t.text, fontSize: 15 },
  cuisineRowActive: { color: t.accent, fontWeight: '700' },
  modalConfirm: {
    backgroundColor: t.accent, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 16,
  },
  modalConfirmText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
