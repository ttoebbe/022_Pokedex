const pokedexData = [];
let filteredPokedexData = [];

const COLOR_CONTRAST_MAP = {
  green: "#221ee2ff",
  red: "#101111ff",
  blue: "#d0dc51ff",
  brown: "#F5F1E6",
  purple: "#F9F7FF",
  white: "#4d4ae2ff",
  yellow: "#1A1300",
};

/**
 * Create a Pokemon data object from API response
 * @param {Object} entry - Basic Pokemon entry
 * @param {Object} details - Detailed Pokemon data
 * @returns {Promise<Object>} Formatted Pokemon data
 */
async function createPokemonData(entry, details) {
  const pokemonColor = await fetchPokemonColor(details.id);
  return {
    id: details.id,
    name: entry.name.toUpperCase(),
    sprite: details.sprites.front_default,
    types: details.types.map((typeObj) => typeObj.type.name),
    color: pokemonColor,
    textColor: textColorMapper(pokemonColor),
    height: details.height / 10,
    weight: details.weight / 10,
    hpAttackDefense: extractPokemonStats(details),
    abilities: extractPokemonAbilities(details),
  };
}

/**
 * Get text color based on background color
 * @param {string} backgroundColor - The background color name
 * @returns {string} The corresponding text color
 */
function textColorMapper(backgroundColor) {
  return COLOR_CONTRAST_MAP[backgroundColor] || "#000000";
}

/**
 * Extract HP, Attack and Defense stats
 * @param {Object} details - Pokemon details
 * @returns {Object} Stats object
 */
function extractPokemonStats(details) {
  let stats = {};
  for (let indexStats = 0; indexStats < details.stats.length; indexStats++) {
    processSingleStat(details.stats[indexStats], stats);
  }
  return stats;
}

/**
 * Process a single stat and add to stats object
 * @param {Object} stat - Stat object
 * @param {Object} stats - Stats accumulator
 */
function processSingleStat(stat, stats) {
  const statName = stat.stat.name;
  const statValue = stat.base_stat;
  stats[statName] = statValue;
  if (statName === "hp" || statName === "attack" || statName === "defense") {
    stats[statName] = statValue;
  }
}

/**
 * Extract ability names
 * @param {Object} details - Pokemon details
 * @returns {string} Comma-separated abilities
 */
function extractPokemonAbilities(details) {
  return details.abilities.map(a => a.ability.name).join(", ");
}