const BASE_URL = "https://pokeapi.co/api/v2/";
const LIMIT_URL = "pokemon?limit=";
const OFFSET_URL = "&offset=";
const COLOR_URL = "pokemon-species/";

/**
 * Fetch Pokemon list from API
 * @param {number} limit - Number of Pokemon to fetch
 * @param {number} offset - Starting index
 * @returns {Promise<Array>} Array of Pokemon entries
 */
async function fetchPokemonList(limit, offset) {
  const response = await fetch(BASE_URL + LIMIT_URL + limit + OFFSET_URL + offset);
  const data = await response.json();
  return data.results;
}

/**
 * Fetch detailed Pokemon data
 * @param {string} url - URL to fetch Pokemon details
 * @returns {Promise<Object>} Pokemon details
 */
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}

/**
 * Fetch the background color of a Pokémon based on its species
 * @param {number} pokemonId - The ID of the Pokémon
 * @returns {Promise<string>} The color name of the Pokémon
 */
async function fetchPokemonColor(pokemonId) {
  const response = await fetch(BASE_URL + COLOR_URL + pokemonId + "/");
  const data = await response.json();
  return data.color.name;
}