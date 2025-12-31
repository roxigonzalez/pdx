# Pokémon Backend API (Rails)

A lightweight Ruby on Rails API backend that serves Pokémon data from [PokeAPI](https://pokeapi.co/).

## Features

- Authentication endpoint (`POST /api/login`)
- Pokémon list with pagination (`GET /api/pokemons`)
- Pokémon detail view (`GET /api/pokemons/:id`)
- CORS enabled for frontend integration
- Concurrent API calls for improved performance

## Setup

1. Install dependencies:
```bash
bundle install
```

2. Start the server:
```bash
rails server
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### POST /api/login
Authenticate a user.

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "username": "admin"
  }
}
```

### GET /api/pokemons
Get a paginated list of Pokémon.

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 20) - Items per page
- `offset` (optional) - Direct offset (overrides page calculation)

**Response:**
```json
{
  "results": [...],
  "count": 1302,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "page": 1,
  "limit": 20,
  "totalPages": 66
}
```

### GET /api/pokemons/:id
Get detailed information about a specific Pokémon.

**Response:**
```json
{
  "id": 1,
  "name": "bulbasaur",
  "number": 1,
  "image": "https://...",
  "abilities": [...],
  "moves": [...],
  "forms": [...],
  "height": 7,
  "weight": 69,
  "types": ["grass", "poison"],
  "base_experience": 64,
  "stats": [...]
}
```

## Environment Variables

- `PORT` - Server port (default: 3001)

## Dependencies

- Rails 7.1.6
- HTTParty - HTTP client for PokeAPI requests
- rack-cors - CORS middleware
- concurrent-ruby - Concurrent programming utilities
