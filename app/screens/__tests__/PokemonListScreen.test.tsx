import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import PokemonListScreen from '../PokemonListScreen';
import { fetchPokemonList, fetchPokemonDetails } from '../../api/pokeApi';

// Mock the API calls
jest.mock('../../api/pokeApi', () => ({
  fetchPokemonList: jest.fn(),
  fetchPokemonDetails: jest.fn(),
}));

// Create a new QueryClient for each test
const queryClient = new QueryClient();

describe('PokemonListScreen', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress React Query error logs
    jest.spyOn(console, 'warn').mockImplementation(() => {});  // Suppress warnings
  });
  
  afterEach(() => {
    jest.restoreAllMocks(); // Restore console logs after each test
  });
  
  it('displays loading state initially', () => {
    (fetchPokemonList as jest.Mock).mockResolvedValueOnce({ results: [] });

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PokemonListScreen />
      </QueryClientProvider>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('fetches and displays Pokémon details', async () => {
    const mockPokemonList = {
      results: [
        { name: 'bulbasaur' },
        { name: 'ivysaur' },
      ],
    };
    const mockPokemonDetails = [
      { name: 'bulbasaur', sprites: { front_default: 'bulbasaur_url' }, types: [{ type: { name: 'grass' } }] },
      { name: 'ivysaur', sprites: { front_default: 'ivysaur_url' }, types: [{ type: { name: 'poison' } }] },
    ];

    // Mock API responses
    (fetchPokemonList as jest.Mock).mockResolvedValueOnce(mockPokemonList);
    (fetchPokemonDetails as jest.Mock).mockResolvedValueOnce(mockPokemonDetails[0]);
    (fetchPokemonDetails as jest.Mock).mockResolvedValueOnce(mockPokemonDetails[1]);

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PokemonListScreen />
      </QueryClientProvider>
    );

    // Wait for the Pokémon details to be rendered
    await waitFor(() => expect(getByText('bulbasaur')).toBeTruthy());
    expect(getByText('ivysaur')).toBeTruthy();
  });

  it('handles error state', async () => {
    (fetchPokemonList as jest.Mock).mockRejectedValueOnce(new Error('Error fetching Pokémon list'));
  
    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PokemonListScreen />
      </QueryClientProvider>
    );
  
    // Ensure React Query updates state correctly after the error
    await waitFor(() => expect(getByText(/Error fetching data/i)).toBeTruthy());
  });
  
  
  
  it('handles pagination', async () => {
    const mockPokemonListPage1 = { results: [{ name: 'bulbasaur' }] };
    const mockPokemonListPage2 = { results: [{ name: 'ivysaur' }] };
    const mockPokemonDetails = [
      { name: 'bulbasaur', sprites: { front_default: 'bulbasaur_url' }, types: [{ type: { name: 'grass' } }] },
      { name: 'ivysaur', sprites: { front_default: 'ivysaur_url' }, types: [{ type: { name: 'poison' } }] },
    ];

    (fetchPokemonList as jest.Mock)
      .mockResolvedValueOnce(mockPokemonListPage1)
      .mockResolvedValueOnce(mockPokemonListPage2);
    (fetchPokemonDetails as jest.Mock).mockResolvedValueOnce(mockPokemonDetails[0]);
    (fetchPokemonDetails as jest.Mock).mockResolvedValueOnce(mockPokemonDetails[1]);

    const { getByText } = render(
      <QueryClientProvider client={queryClient}>
        <PokemonListScreen />
      </QueryClientProvider>
    );

    // Check initial page and Pokémon
    await waitFor(() => expect(getByText('bulbasaur')).toBeTruthy());
    expect(getByText('Page 1')).toBeTruthy();

    // Simulate "Next" button press
    await act(async () => {
      fireEvent.press(getByText('Next'));
    });

    // Check new page and new Pokémon
    await waitFor(() => expect(getByText('ivysaur')).toBeTruthy());
    expect(getByText('Page 2')).toBeTruthy();
  });
});
