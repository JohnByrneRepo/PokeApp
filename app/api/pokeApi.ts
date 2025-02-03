// src/api/pokeApi.ts
import axios from 'axios';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchPokemonList = async (page: number) => {
  const offset = (page - 1) * 10;
  const response = await axios.get(`${API_URL}?limit=10&offset=${offset}`);
  return response.data;
};

export const fetchPokemonDetails = async (nameOrId: string) => {
  const response = await axios.get(`${API_URL}/${nameOrId}`);
  return response.data;
};

export default {
  fetchPokemonList,
  fetchPokemonDetails
};
