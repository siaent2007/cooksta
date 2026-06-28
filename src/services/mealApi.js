const BASE = 'https://www.themealdb.com/api/json/v1/1';

async function get(url) {
  const res = await fetch(url);
  return res.json();
}

export async function getRandomMeal() {
  const data = await get(`${BASE}/random.php`);
  return data.meals?.[0] ?? null;
}

export async function getMealById(id) {
  const data = await get(`${BASE}/lookup.php?i=${id}`);
  return data.meals?.[0] ?? null;
}

export async function searchByIngredient(ingredient) {
  const data = await get(`${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`);
  return data.meals ?? [];
}

export async function filterByArea(area) {
  const data = await get(`${BASE}/filter.php?a=${encodeURIComponent(area)}`);
  return data.meals ?? [];
}

export function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing?.trim()) items.push({ ingredient: ing.trim(), measure: (measure ?? '').trim() });
  }
  return items;
}

export async function findRecipes(ingredients, area) {
  try {
    let results = [];

    if (ingredients.length > 0) {
      const searches = await Promise.all(ingredients.map(searchByIngredient));
      const nonEmpty = searches.filter((s) => s.length > 0);
      if (nonEmpty.length > 0) {
        const idSets = nonEmpty.map((arr) => new Set(arr.map((m) => m.idMeal)));
        const common = [...idSets[0]].filter((id) => idSets.every((s) => s.has(id)));
        results = common.length > 0
          ? nonEmpty[0].filter((m) => common.includes(m.idMeal))
          : nonEmpty.flat().filter((m, i, a) => a.findIndex((x) => x.idMeal === m.idMeal) === i);
      }
    }

    if (area && area !== 'Any') {
      const byArea = await filterByArea(area);
      if (results.length > 0) {
        const areaIds = new Set(byArea.map((m) => m.idMeal));
        const filtered = results.filter((m) => areaIds.has(m.idMeal));
        results = filtered.length > 0 ? filtered : byArea.slice(0, 20);
      } else {
        results = byArea;
      }
    }

    if (results.length === 0) {
      const randoms = await Promise.all(Array.from({ length: 6 }, getRandomMeal));
      results = randoms
        .filter(Boolean)
        .map((m) => ({ idMeal: m.idMeal, strMeal: m.strMeal, strMealThumb: m.strMealThumb, strArea: m.strArea }));
    }

    return results.slice(0, 20);
  } catch {
    return [];
  }
}
