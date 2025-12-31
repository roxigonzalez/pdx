require 'httparty'
require 'concurrent'

class PokeApiService
  BASE_URL = 'https://pokeapi.co/api/v2'.freeze

  def self.get_pokemon_list(offset: 0, limit: 20)
    response = HTTParty.get("#{BASE_URL}/pokemon?offset=#{offset}&limit=#{limit}")
    
    unless response.success?
      raise StandardError, 'Failed to fetch from PokeAPI'
    end

    data = JSON.parse(response.body)
    
    pokemon_futures = data['results'].map do |pokemon|
      Concurrent::Future.execute do
        get_pokemon_by_url(pokemon['url'])
      end
    end

    pokemon_list = pokemon_futures.map(&:value)

    {
      results: pokemon_list,
      count: data['count'],
      next: data['next'],
      previous: data['previous']
    }
  end

  def self.get_pokemon_by_id(id)
    response = HTTParty.get("#{BASE_URL}/pokemon/#{id}")
    
    unless response.success?
      if response.code == 404
        raise ActiveRecord::RecordNotFound, 'Pokémon not found'
      end
      raise StandardError, 'Failed to fetch from PokeAPI'
    end

    parse_pokemon_detail(JSON.parse(response.body))
  end

  def self.get_pokemon_by_url(url)
    response = HTTParty.get(url)
    unless response.success?
      raise StandardError, 'Failed to fetch from PokeAPI'
    end
    parse_pokemon_list_item(JSON.parse(response.body))
  end

  private

  def self.parse_pokemon_list_item(pokemon_data)
    {
      id: pokemon_data['id'],
      name: pokemon_data['name'],
      number: pokemon_data['id'],
      image: pokemon_data.dig('sprites', 'other', 'official-artwork', 'front_default') ||
             pokemon_data.dig('sprites', 'front_default')
    }
  end

  def self.parse_pokemon_detail(pokemon_data)
    {
      id: pokemon_data['id'],
      name: pokemon_data['name'],
      number: pokemon_data['id'],
      image: pokemon_data.dig('sprites', 'other', 'official-artwork', 'front_default') ||
             pokemon_data.dig('sprites', 'front_default'),
      abilities: pokemon_data['abilities'].map do |ability|
        {
          name: ability['ability']['name'],
          is_hidden: ability['is_hidden'],
          slot: ability['slot']
        }
      end,
      moves: pokemon_data['moves'].map do |move|
        {
          name: move['move']['name'],
          learn_method: move['version_group_details']&.first&.dig('move_learn_method', 'name')
        }
      end,
      forms: pokemon_data['forms'].map do |form|
        {
          name: form['name'],
          url: form['url']
        }
      end,
      height: pokemon_data['height'],
      weight: pokemon_data['weight'],
      types: pokemon_data['types'].map { |type| type['type']['name'] },
      base_experience: pokemon_data['base_experience'],
      stats: pokemon_data['stats'].map do |stat|
        {
          name: stat['stat']['name'],
          base_stat: stat['base_stat']
        }
      end
    }
  end
end
