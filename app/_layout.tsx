// src/App.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider } from 'react-query';
import PokemonListScreen from './screens/PokemonListScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { FavoritesProvider } from './context/FavoritesContext';

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

const App = () => {
  return (
    <FavoritesProvider>
      <QueryClientProvider client={queryClient}>
        <Tab.Navigator>
          <Tab.Screen name="Pokémon List" component={PokemonListScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
        </Tab.Navigator>
      </QueryClientProvider>
    </FavoritesProvider>
  );
};

export default App;
