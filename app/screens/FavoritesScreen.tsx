// src/screens/FavoritesScreen.tsx
import React from 'react';
import { View, FlatList, Button, Text, StyleSheet } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import { useFavorites } from '../context/FavoritesContext';

const FavoritesScreen = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text>No favorites added yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.name}
          ItemSeparatorComponent={() => <View style={{height: 20}} />}
          renderItem={({ item }) => (
            <View>
              <PokemonCard
                name={item.name}
                imageUrl={item.sprites.front_default}
                types={item.types.map((t: any) => t.type.name)}
              />
              <Button title="Remove from Favorites" onPress={() => removeFromFavorites(item.name)} />
            </View>
          )}
        />
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default FavoritesScreen;
