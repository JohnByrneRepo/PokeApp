import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FavoritesScreen from '../../screens/FavoritesScreen'; // assuming you export it
import { FavoritesProvider, useFavorites } from '../../context/FavoritesContext';
import PokemonCard from '../../components/PokemonCard';

// Helper component to use the context directly in the test
const TestComponent = () => {
  const { favorites, addToFavorites } = useFavorites();
  
  // Manually adding a Pokémon to favorites
  React.useEffect(() => {
    const mockFavoritePokemon = {
      name: 'bulbasaur',
      sprites: { front_default: 'https://example.com/bulbasaur.png' },
      types: [{ type: { name: 'grass' } }],
    };
    addToFavorites(mockFavoritePokemon);
  }, [addToFavorites]);

  return <FavoritesScreen />;
};

describe('FavoritesScreen', () => {
  it('should display "bulbasaur" in favorites', async () => {
    // Render the test component wrapped with the FavoritesProvider
    const { getByText } = render(
      <FavoritesProvider>
        <TestComponent />
      </FavoritesProvider>
    );

    // Wait for the component to update with the new favorite Pokémon
    await waitFor(() => getByText('bulbasaur'));

    // Check if "bulbasaur" appears in the favorites list
    expect(getByText('bulbasaur')).toBeTruthy();
  });

  it('should render empty state when no favorites', () => {
    // Render FavoritesScreen with no favorites
    const { getByText } = render(
      <FavoritesProvider>
        <FavoritesScreen />
      </FavoritesProvider>
    );

    // Check if the empty state message is shown
    expect(getByText('No favorites added yet.')).toBeTruthy();
  });
});
