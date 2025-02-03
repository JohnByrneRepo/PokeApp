// src/screens/__tests__/FavoritesScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FavoritesScreen from '../FavoritesScreen';
import { useFavorites } from '../../context/FavoritesContext';
import { Text } from 'react-native';

// Mock the useFavorites context
jest.mock('../../context/FavoritesContext', () => ({
  useFavorites: jest.fn(),
}));

describe('FavoritesScreen', () => {
  it('displays a message when no favorites are added', () => {
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      removeFromFavorites: jest.fn(),
    });

    const { getByText } = render(<FavoritesScreen />);
    expect(getByText('No favorites added yet.')).toBeTruthy();
  });

  it('calls removeFromFavorites when "Remove from Favorites" button is pressed', () => {
    const mockFavorites = [
      {
        name: 'bulbasaur',
        sprites: { front_default: 'bulbasaur_image_url' },
        types: [{ type: { name: 'grass' } }],
      },
    ];

    const removeFromFavoritesMock = jest.fn();
    
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: mockFavorites,
      removeFromFavorites: removeFromFavoritesMock,
    });

    const { getByText } = render(<FavoritesScreen />);
    
    // Wait for the Pokémon card to render
    waitFor(() => getByText('bulbasaur'));

    // Simulate pressing the "Remove from Favorites" button
    fireEvent.press(getByText('Remove from Favorites'));

    // Check if removeFromFavorites was called with the correct Pokémon name
    expect(removeFromFavoritesMock).toHaveBeenCalledWith('bulbasaur');
  });
});
