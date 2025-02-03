import React from 'react';
import { render } from '@testing-library/react-native';
import PokemonCard from '../PokemonCard';

const mockProps = {
  name: 'bulbasaur',
  imageUrl: 'https://example.com/bulbasaur.png',
  types: ['grass', 'poison'],
};

describe('PokemonCard', () => {
  it('renders Pokémon name, image, and types correctly', () => {
    const { getByText, getByTestId } = render(<PokemonCard {...mockProps} />);

    // Test if Pokémon name is rendered correctly
    const nameText = getByTestId('pokemon-name');
    expect(nameText.props.children).toBe('bulbasaur');

    // Test if image is rendered with the correct source URL
    const image = getByTestId('pokemon-image');
    expect(image.props.source.uri).toBe('https://example.com/bulbasaur.png');

    // Test if types are rendered correctly
    const typesText = getByText('grass, poison');
    expect(typesText).toBeTruthy();
  });
});
