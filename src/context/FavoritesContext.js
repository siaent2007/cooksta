import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveData, loadData, KEYS } from '../utils/storage';

const FavoritesContext = createContext({});

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadData(KEYS.FAVORITES).then((saved) => {
      if (saved) setFavorites(saved);
    });
  }, []);

  const isFavorite = (id) => favorites.some((r) => r.idMeal === id);

  const toggleFavorite = async (recipe) => {
    const updated = isFavorite(recipe.idMeal)
      ? favorites.filter((r) => r.idMeal !== recipe.idMeal)
      : [...favorites, recipe];
    setFavorites(updated);
    await saveData(KEYS.FAVORITES, updated);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
