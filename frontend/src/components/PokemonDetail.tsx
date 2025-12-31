import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pokemonService } from '../services/api';
import { PokemonDetail as PokemonDetailType } from '../types';
import './PokemonDetail.css';

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchPokemonDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPokemonDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await pokemonService.getPokemonById(id!);
      setPokemon(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pokemon details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pokemon-detail-container">
        <div className="loading">Loading pokemon details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-detail-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/')} className="back-button">
          Back to List
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return null;
  }

  const statNameMap: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'ATK',
    'defense': 'DEF',
    'special-attack': 'SATK',
    'special-defense': 'SDEF',
    'speed': 'SPD'
  };

  const formatWeight = (weight: number) => {
    return (weight / 10).toFixed(1);
  };

  const formatHeight = (height: number) => {
    return (height / 10).toFixed(1);
  };

  const getTypeColor = (type: string): string => {
    const typeMap: { [key: string]: string } = {
      bug: '#A7B723',
      dark: '#75574C',
      dragon: '#7037FF',
      electric: '#F9CF30',
      fairy: '#E69EAC',
      fighting: '#C12239',
      fire: '#F57D31',
      flying: '#A891EC',
      ghost: '#70559B',
      normal: '#AAA67F',
      grass: '#74CB48',
      ground: '#DEC16B',
      ice: '#9AD6DF',
      poison: '#A43E9E',
      psychic: '#FB5584',
      rock: '#B69E31',
      steel: '#B7B9D0',
      water: '#6493EB',
    };
    return typeMap[type.toLowerCase()] || '#DC0A2D';
  };

  const primaryType = pokemon.types[0] || 'normal';
  const primaryTypeColor = getTypeColor(primaryType);

  const formatStatValue = (value: number): string => {
    return value.toString().padStart(3, '0');
  };

  const formatNumber = (num: number): string => {
    return `#${num.toString().padStart(3, '0')}`;
  };

  const getDescription = (): string => {
    return "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.";
  };

  const getAbilitiesForMoves = (): string[] => {
    const nonHiddenAbilities = pokemon.abilities
      .filter(ability => !ability.is_hidden)
      .slice(0, 2)
      .map(ability => ability.name);
    return nonHiddenAbilities.length > 0 ? nonHiddenAbilities : pokemon.moves.slice(0, 2).map(move => move.name);
  };

  return (
    <div className="pokemon-detail-container">
      <header 
        className="detail-header" 
        style={{ backgroundColor: primaryTypeColor }}
      >
        <button onClick={() => navigate('/')} className="back-arrow-button" aria-label="Back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="detail-header-name">{pokemon.name}</h1>
        <span className="detail-header-number">{formatNumber(pokemon.number)}</span>
        {/* TODO: Add right chevron for next/prev navigation */}
      </header>

      <div className="pokemon-hero-section" style={{ backgroundColor: primaryTypeColor }}>
        <div className="pokemon-image-wrapper">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-detail-image"
          />
        </div>
      </div>

      <div className="pokemon-card">
        <div className="pokemon-types-section">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>

        <div className="pokemon-detail-sections">
          <div className="detail-section">
            <h2 style={{ color: primaryTypeColor }}>About</h2>
            <div className="about-row">
              <div className="about-column">
                <div className="about-icon icon-weight">
                  <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.995737 11.3333H9.7624L8.7124 4H2.04574L0.995737 11.3333ZM5.37907 3C5.66796 3 5.90685 2.90278 6.09574 2.70833C6.28463 2.51389 6.37907 2.27778 6.37907 2C6.37907 1.71111 6.28463 1.47222 6.09574 1.28333C5.90685 1.09444 5.66796 1 5.37907 1C5.10129 1 4.86518 1.09444 4.67074 1.28333C4.47629 1.47222 4.37907 1.71111 4.37907 2C4.37907 2.27778 4.47629 2.51389 4.67074 2.70833C4.86518 2.90278 5.10129 3 5.37907 3ZM7.1124 3H8.7124C8.96796 3 9.19018 3.08056 9.37907 3.24167C9.56796 3.40278 9.67907 3.61111 9.7124 3.86667L10.7457 11.2C10.7902 11.5 10.7152 11.7639 10.5207 11.9917C10.3263 12.2194 10.0735 12.3333 9.7624 12.3333H0.995737C0.684625 12.3333 0.431847 12.2194 0.237403 11.9917C0.0429586 11.7639 -0.0320413 11.5 0.0124031 11.2L1.04574 3.86667C1.07907 3.61111 1.19018 3.40278 1.37907 3.24167C1.56796 3.08056 1.79018 3 2.04574 3H3.64574C3.55685 2.84444 3.49018 2.68611 3.44574 2.525C3.40129 2.36389 3.37907 2.18889 3.37907 2C3.37907 1.44444 3.57351 0.972222 3.9624 0.583333C4.35129 0.194444 4.82351 0 5.37907 0C5.93463 0 6.40685 0.194444 6.79574 0.583333C7.18463 0.972222 7.37907 1.44444 7.37907 2C7.37907 2.18889 7.35685 2.36389 7.3124 2.525C7.26796 2.68611 7.20129 2.84444 7.1124 3ZM0.995737 11.3333H9.7624H0.995737Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="about-value">{formatWeight(pokemon.weight)} kg</div>
                <div className="about-label">Weight</div>
              </div>
              <div className="about-column-divider"></div>
              <div className="about-column">
                <div className="about-icon icon-height">
                  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-2.38419e-07 1C-2.38419e-07 0.733333 0.1 0.5 0.3 0.3C0.5 0.1 0.733333 0 1 0L7 0C7.25556 0 7.48611 0.1 7.69167 0.3C7.89722 0.5 8 0.733333 8 1V12.3333C8 12.6 7.89722 12.8333 7.69167 13.0333C7.48611 13.2333 7.25556 13.3333 7 13.3333H1C0.733333 13.3333 0.5 13.2333 0.3 13.0333C0.1 12.8333 -2.38419e-07 12.6 -2.38419e-07 12.3333V1ZM1 1L1 12.3333H7V10.1667H4V9.16667H7L7 7.16667H4V6.16667H7V4.16667H4V3.16667L7 3.16667V1L1 1ZM4 3.16667V4.16667V3.16667ZM4 6.16667V7.16667V6.16667ZM4 9.16667V10.1667V9.16667Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="about-value">{formatHeight(pokemon.height)} m</div>
                <div className="about-label">Height</div>
              </div>
              <div className="about-column-divider"></div>
              <div className="about-column about-moves">
                <div className="moves-list">
                  {getAbilitiesForMoves().map((move, index) => (
                    <span key={`${move}-${index}`} className="move-name">{move}</span>
                  ))}
                </div>
                <div className="about-label">Moves</div>
              </div>
            </div>
            <p className="pokemon-description">{getDescription()}</p>
          </div>

          <div className="detail-section">
            <h2 style={{ color: primaryTypeColor }}>Base Stats</h2>
            <div className="stats-list">
              {pokemon.stats.map((stat, index) => {
                const displayName = statNameMap[stat.name] || stat.name.toUpperCase();
                const statPercentage = Math.min(Math.max((stat.base_stat / 150) * 100, 0), 100);
                return (
                  <div key={index} className="stat-item">
                    <span className="stat-label" style={{ color: primaryTypeColor }}>{displayName}</span>
                    <span className="stat-value">{formatStatValue(stat.base_stat)}</span>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar"
                        style={{ 
                          width: `${statPercentage}%`,
                          backgroundColor: primaryTypeColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
