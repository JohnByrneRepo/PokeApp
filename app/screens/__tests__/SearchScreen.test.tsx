import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react-native';
import SearchScreen from '../SearchScreen';
import { useFavorites } from '../../context/FavoritesContext';
import * as pokeApi from '../../api/pokeApi';

// Mocking the Favorites Context
jest.mock('../../context/FavoritesContext', () => ({
  useFavorites: jest.fn(),
}));

// Mocking the fetchPokemonDetails function with jest.fn()
jest.mock('../../api/pokeApi', () => ({
  fetchPokemonDetails: jest.fn(),
}));

describe('SearchScreen', () => {
  const addToFavoritesMock = jest.fn();

  beforeEach(() => {
    // TypeScript needs to know about the mock functions explicitly
    (useFavorites as jest.Mock).mockReturnValue({
      favorites: [],
      addToFavorites: addToFavoritesMock,
    });

    // Reset the mock to ensure each test gets a fresh instance
    (pokeApi.fetchPokemonDetails as jest.Mock).mockReset();
  });

  it('should render input and search button', () => {
    render(<SearchScreen />);
    expect(screen.getByPlaceholderText('Search Pokémon...')).toBeTruthy();
    expect(screen.getByText('Search')).toBeTruthy();
  });

  it('should show loading indicator when searching', async () => {
    render(<SearchScreen />);
    fireEvent.changeText(screen.getByPlaceholderText('Search Pokémon...'), 'pikachu');
    fireEvent.press(screen.getByText('Search'));
    await waitFor(() => expect(screen.getByText('Loading...')).toBeTruthy());
  });

  it('should display Pokémon details after successful search', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
    };
    (pokeApi.fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemon);

    render(<SearchScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Search Pokémon...'), 'pikachu');

    await act(async () => {
      fireEvent.press(screen.getByText('Search'));
    });

    await waitFor(() => expect(screen.getByText('pikachu')).toBeTruthy());
    expect(screen.getByText('electric')).toBeTruthy();
  });

  it('should display error message when Pokémon is not found', async () => {
    (pokeApi.fetchPokemonDetails as jest.Mock).mockRejectedValue(new Error('Pokémon not found'));

    render(<SearchScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Search Pokémon...'), 'nonexistentpokemon');

    await act(async () => {
      fireEvent.press(screen.getByText('Search'));
    });

    await waitFor(() => expect(screen.getByText('Pokémon not found')).toBeTruthy());
  });

  it('should add Pokémon to favorites', async () => {
    const mockPokemon = {
      name: 'pikachu',
      sprites: { front_default: 'https://example.com/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
    };
    (pokeApi.fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemon);

    render(<SearchScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Search Pokémon...'), 'pikachu');

    await act(async () => {
      fireEvent.press(screen.getByText('Search'));
    });

    await waitFor(() => expect(screen.getByText('pikachu')).toBeTruthy());
    fireEvent.press(screen.getByText('Add to Favorites'));
    expect(addToFavoritesMock).toHaveBeenCalledWith(mockPokemon);
  });
});
