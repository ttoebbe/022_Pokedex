const limit = 20;
let offset = 0;

/**
 * Initial load on page load
 */
async function onloadInit() {
  showLoadingSpinner(true);
  await loadPokemonBaseData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

/**
 * Load more Pokemon
 */
async function loadMorePokemon() {
  showLoadingSpinner(true);
  await loadPokemonBaseData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

/**
 * Load Pokemon base data from API
 */
async function loadPokemonBaseData() {
  const newEntries = await fetchPokemonList(limit, offset);
  await loadPokemonDetails(newEntries);
  offset += limit;
}

/**
 * Fetch and process Pokemon details
 * @param {Array} newEntries - Pokemon entries
 */
async function loadPokemonDetails(newEntries) {
  for (const entry of newEntries) {
    const details = await fetchPokemonDetails(entry.url);
    const pokemonData = await createPokemonData(entry, details);
    pokedexData.push(pokemonData);
  }
}