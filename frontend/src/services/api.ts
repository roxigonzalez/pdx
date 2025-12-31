import axios from 'axios';
import { PokemonDetail, PokemonListResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    username: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  },
};

export const pokemonService = {
  getPokemons: async (
    page: number = 1,
    limit: number = 20
  ): Promise<PokemonListResponse> => {
    const response = await api.get<PokemonListResponse>('/pokemons', {
      params: { page, limit },
    });
    return response.data;
  },

  getPokemonById: async (id: string | number): Promise<PokemonDetail> => {
    const response = await api.get<PokemonDetail>(`/pokemons/${id}`);
    return response.data;
  },
};

export default api;
