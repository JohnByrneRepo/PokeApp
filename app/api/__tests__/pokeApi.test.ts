import axios from 'axios';
import { fetchPokemonList, fetchPokemonDetails } from '../pokeApi';

// Mocking axios
jest.mock('axios');

describe('pokeApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchPokemonList should return a list of Pokémon', async () => {
    const mockResponse = {
      data: {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ],
      },
    };

    // Mock axios GET request
    (axios.get as jest.Mock).mockResolvedValueOnce(mockResponse);

    const page = 1;
    const result = await fetchPokemonList(page);

    // Check if axios was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    
    // Verify the response data
    expect(result).toEqual(mockResponse.data);
    expect(result.results.length).toBe(2);
    expect(result.results[0].name).toBe('bulbasaur');
  });

  it('fetchPokemonDetails should return details for a single Pokémon', async () => {
    const mockDetailsResponse = {
      data: {
        name: 'bulbasaur',
        id: 1,
        sprites: { front_default: 'https://example.com/bulbasaur.png' },
        types: [{ type: { name: 'grass' } }],
      },
    };

    // Mock axios GET request
    (axios.get as jest.Mock).mockResolvedValueOnce(mockDetailsResponse);

    const pokemonName = 'bulbasaur';
    const result = await fetchPokemonDetails(pokemonName);

    // Check if axios was called with the correct URL
    expect(axios.get).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    
    // Verify the response data
    expect(result).toEqual(mockDetailsResponse.data);
    expect(result.name).toBe('bulbasaur');
    expect(result.sprites.front_default).toBe('https://example.com/bulbasaur.png');
  });

  it('should handle errors in fetchPokemonList', async () => {
    const mockError = new Error('Network Error');
    
    // Mock axios GET to simulate an error
    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

    const page = 1;
    
    try {
      await fetchPokemonList(page);
    } catch (error) {
      // Check if the error is correctly thrown
      expect(error).toEqual(mockError);
    }
  });

  it('should handle errors in fetchPokemonDetails', async () => {
    const mockError = new Error('Pokemon not found');
    
    // Mock axios GET to simulate an error
    (axios.get as jest.Mock).mockRejectedValueOnce(mockError);

    const pokemonName = 'nonexistentpokemon';
    
    try {
      await fetchPokemonDetails(pokemonName);
    } catch (error) {
      // Check if the error is correctly thrown
      expect(error).toEqual(mockError);
    }
  });
});
