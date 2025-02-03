// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FavoritesContextType {
  favorites: any[];
  addToFavorites: (pokemon: any) => void;
  removeFromFavorites: (pokemonName: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  // Load favorites from AsyncStorage on initial render
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Failed to load favorites', error);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever the list changes
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  const addToFavorites = (pokemon: any) => {
    if (!favorites.some((fav) => fav.name === pokemon.name)) {
      setFavorites((prevFavorites) => [...prevFavorites, pokemon]);
    }
  };

  const removeFromFavorites = (pokemonName: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((pokemon) => pokemon.name !== pokemonName)
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default {
  FavoritesProvider,
  useFavorites
};
