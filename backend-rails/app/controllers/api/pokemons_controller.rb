module Api
  class PokemonsController < ApplicationController
    def index
      page = params[:page]&.to_i || 1
      limit = params[:limit]&.to_i || 20
      offset = params[:offset]&.to_i || (page - 1) * limit

      result = PokeApiService.get_pokemon_list(offset: offset, limit: limit)
      
      render json: {
        results: result[:results],
        count: result[:count],
        next: result[:next],
        previous: result[:previous],
        page: page,
        limit: limit,
        totalPages: (result[:count].to_f / limit).ceil
      }
    rescue => e
      Rails.logger.error("Pokemons list error: #{e.message}")
      render json: { error: 'Failed to fetch pokemons' }, status: :internal_server_error
    end

    def show
      pokemon = PokeApiService.get_pokemon_by_id(params[:id])
      render json: pokemon
    rescue ActiveRecord::RecordNotFound => e
      render json: { error: e.message }, status: :not_found
    rescue => e
      Rails.logger.error("Pokemon detail error: #{e.message}")
      render json: { error: 'Failed to fetch pokemon details' }, status: :internal_server_error
    end
  end
end
