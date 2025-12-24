/**
 * Render the complete Pokédex list
 */
function renderPokedexListView() {
  const listContainer = document.getElementById("pokedex-container");
  listContainer.innerHTML = pokedexData.map((pokemon, index) => 
    renderPokemonItem(pokemon, index)
  ).join('');
}

/**
 * Render filtered Pokemon
 * @param {string} searchInput - Search query
 */
function renderFilteredPokemon(searchInput) {
  const listContainer = document.getElementById("pokedex-container");
  filteredPokedexData = [];
  
  const html = pokedexData
    .map((pokemon, index) => {
      if (pokemon.name.toLowerCase().includes(searchInput)) {
        filteredPokedexData.push({ ...pokemon, originalIndex: index });
        return renderPokemonItem(pokemon, index);
      }
      return '';
    })
    .join('');
  
  listContainer.innerHTML = html || "<p>No Pokemon found.</p>";
}

/**
 * Show or hide loading spinner
 * @param {boolean} isLoading - Whether to show the loading spinner
 */
function showLoadingSpinner(isLoading) {
  document.getElementById("loading-overlay").classList.toggle("d-none", !isLoading);
}

/**
 * Toggle visibility of 'More Pokemon' button based on filter state
 */
function toggleVisibilityMorePokemonButton() {
  document.getElementById("more-pokemon-btn").classList.toggle("d-none", isFiltering);
}

/**
 * Render type badges for a Pokemon
 * @param {Array<string>} types - Array of Pokemon types
 * @returns {string} HTML string for type badges
 */
function renderTypeBadges(types) {
  return types.map(type => `<span class="type-badge">${type}</span>`).join('');
}