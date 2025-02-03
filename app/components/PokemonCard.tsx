// src/components/PokemonCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

type PokemonCardProps = {
  name: string;
  imageUrl: string;
  types: string[];
};

const testIDs = {
  card: 'pokemon-card',
  image: 'pokemon-image',
  name: 'pokemon-name'
};

const PokemonCard: React.FC<PokemonCardProps> = ({ name, imageUrl, types }) => {
  return (
    <View testID={testIDs.card} style={styles.card}>
      <Image testID={testIDs.image} source={{ uri: imageUrl }} style={styles.image} />
      <Text testID={testIDs.name} style={styles.name}>{name}</Text>
      <Text style={styles.types}>{types.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  types: {
    fontSize: 14,
    color: 'gray',
  },
});

export default PokemonCard;
