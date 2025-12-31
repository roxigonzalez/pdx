import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

app.use(cors());
app.use(express.json());

const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    if (username === VALID_CREDENTIALS.username && 
        password === VALID_CREDENTIALS.password) {
      return res.status(200).json({ 
        success: true,
        message: 'Login successful',
        user: { username }
      });
    } else {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/pokemons', async (req, res) => {
  try {
    const { page = 1, limit = 20, offset } = req.query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offsetNumber = offset ? parseInt(offset) : (pageNumber - 1) * limitNumber;

    const response = await fetch(
      `${POKEAPI_BASE_URL}/pokemon?offset=${offsetNumber}&limit=${limitNumber}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from PokeAPI');
    }

    const data = await response.json();
    
    const pokemonPromises = data.results.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();
      return {
        id: pokemonData.id,
        name: pokemonData.name,
        number: pokemonData.id,
        image: pokemonData.sprites.other['official-artwork'].front_default || 
               pokemonData.sprites.front_default
      };
    });

    const pokemonList = await Promise.all(pokemonPromises);

    res.json({
      results: pokemonList,
      count: data.count,
      next: data.next,
      previous: data.previous,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(data.count / limitNumber)
    });
  } catch (error) {
    console.error('Pokemons list error:', error);
    res.status(500).json({ error: 'Failed to fetch pokemons' });
  }
});

app.get('/api/pokemons/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Pokémon not found' });
      }
      throw new Error('Failed to fetch from PokeAPI');
    }

    const pokemonData = await response.json();

    const abilities = pokemonData.abilities.map(ability => ({
      name: ability.ability.name,
      is_hidden: ability.is_hidden,
      slot: ability.slot
    }));

    const moves = pokemonData.moves.map(move => ({
      name: move.move.name,
      learn_method: move.version_group_details[0]?.move_learn_method?.name || null
    }));

    const forms = pokemonData.forms.map(form => ({
      name: form.name,
      url: form.url
    }));

    const pokemonDetail = {
      id: pokemonData.id,
      name: pokemonData.name,
      number: pokemonData.id,
      image: pokemonData.sprites.other['official-artwork'].front_default || 
             pokemonData.sprites.front_default,
      abilities,
      moves,
      forms,
      height: pokemonData.height,
      weight: pokemonData.weight,
      types: pokemonData.types.map(type => type.type.name),
      base_experience: pokemonData.base_experience,
      stats: pokemonData.stats.map(stat => ({
        name: stat.stat.name,
        base_stat: stat.base_stat
      }))
    };

    res.json(pokemonDetail);
  } catch (error) {
    console.error('Pokemon detail error:', error);
    res.status(500).json({ error: 'Failed to fetch pokemon details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
