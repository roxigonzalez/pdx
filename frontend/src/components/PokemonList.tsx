import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { pokemonService } from '../services/api';
import { Pokemon, SortOption } from '../types';
import { authUtils } from '../utils/auth';
import './PokemonList.css';

export const PokemonList: React.FC = () => {
  const navigate = useNavigate();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('number');

  const fetchPokemons = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await pokemonService.getPokemons(page, 20);
      setPokemons(data.results);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch pokemons');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchPokemons();
  }, [fetchPokemons]);

  const handleLogout = () => {
    authUtils.clearAuth();
    navigate('/login');
  };

  const filteredAndSortedPokemons = useMemo(() => {
    let filtered = pokemons;

    if (search.trim()) {
      filtered = pokemons.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.number.toString().includes(search)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.number - b.number;
      }
    });

    return sorted;
  }, [pokemons, search, sortBy]);

  return (
    <div className="pokemon-list-container">
      <header className="pokemon-header">
        <div className="header-left">
          <svg className="pokeball-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
          <h1>Pokédex</h1>
        </div>
        <div className="header-right">
          <button onClick={handleLogout} className="header-menu-button" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </div>
      </header>

      <div className="search-section">
        <div className={`search-input-wrapper ${search ? 'has-value' : ''}`}>
          <svg
            className="search-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="sort-container-mobile">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="sort-select"
        >
          <option value="number">Number</option>
          <option value="name">Name</option>
        </select>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading pokemons...</div>
      ) : (
        <>
          <div className="pokemon-grid">
            {filteredAndSortedPokemons.map((pokemon) => (
              <div
                key={pokemon.id}
                className="pokemon-card"
                onClick={() => navigate(`/pokemon/${pokemon.id}`)}
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <div className="pokemon-info">
                  <h3 className="pokemon-name">{pokemon.name}</h3>
                  <span className="pokemon-number">#{pokemon.number}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedPokemons.length === 0 && !loading && (
            <div className="no-results">No pokemons found</div>
          )}

          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="pagination-button"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || loading}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
