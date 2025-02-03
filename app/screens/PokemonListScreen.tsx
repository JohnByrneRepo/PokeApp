// src/screens/PokemonListScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Button, Text, StyleSheet } from 'react-native';
import { useQuery } from 'react-query';
import { fetchPokemonList, fetchPokemonDetails } from '../api/pokeApi';
import PokemonCard from '../components/PokemonCard';

const PokemonListScreen = () => {
  const [page, setPage] = useState(1);
  const [pokemonDetails, setPokemonDetails] = useState<any[]>([]);

  const { data, isLoading, error } = useQuery(['pokemonList', page], () => fetchPokemonList(page), {
    retry: false, // Avoid retrying failed requests
    onSuccess: async (data) => {
      const detailsPromises = data.results.map((pokemon: any) => fetchPokemonDetails(pokemon.name));
      const details = await Promise.all(detailsPromises);
      setPokemonDetails(details);
    },
  });

  if (isLoading) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (error || !data) return <View style={styles.center}><Text>Error fetching data</Text></View>;  // Handle undefined `data`

  return (
    <View style={styles.container}>
      <FlatList
        data={pokemonDetails}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonCard
            name={item.name}
            imageUrl={item.sprites.front_default}
            types={item.types.map((t: any) => t.type.name)}
          />
        )}
      />
      <View style={styles.pagination}>
        <Button title="Previous" onPress={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} />
        <Text style={styles.pageText}>Page {page}</Text>
        <Button title="Next" onPress={() => setPage((prev) => prev + 1)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  pageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PokemonListScreen;
