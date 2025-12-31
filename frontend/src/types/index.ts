export interface Pokemon {
  id: number;
  name: string;
  number: number;
  image: string;
}

export interface PokemonDetail extends Pokemon {
  abilities: Ability[];
  moves: Move[];
  forms: Form[];
  height: number;
  weight: number;
  types: string[];
  base_experience: number;
  stats: Stat[];
}

export interface Ability {
  name: string;
  is_hidden: boolean;
  slot: number;
}

export interface Move {
  name: string;
  learn_method: string | null;
}

export interface Form {
  name: string;
  url: string;
}

export interface Stat {
  name: string;
  base_stat: number;
}

export interface PokemonListResponse {
  results: Pokemon[];
  count: number;
  next: string | null;
  previous: string | null;
  page: number;
  limit: number;
  totalPages: number;
}

export type SortOption = 'name' | 'number';
