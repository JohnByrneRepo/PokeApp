// src/screens/PokemonSearchScreen.tsx
import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, TextInput } from 'react-native';
import { fetchPokemonDetails } from '../api/pokeApi';
import PokemonCard from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';

const PokemonSearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { favorites, addToFavorites } = useFavorites();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setError(null);
    setSearchResults(null);
    try {
      const details = await fetchPokemonDetails(searchTerm.toLowerCase());
      setSearchResults(details);
    } catch (err) {
      setError('Pokémon not found');
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Pokémon..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Search" onPress={handleSearch} />
      {loading && <Text>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      {searchResults && (
        <View>
          <PokemonCard
            name={searchResults.name}
            imageUrl={searchResults.sprites.front_default}
            types={searchResults.types.map((t: any) => t.type.name)}
          />
          <Button title="Add to Favorites" onPress={() => addToFavorites(searchResults)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default PokemonSearchScreen;
