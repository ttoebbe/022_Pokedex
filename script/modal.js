let currentPokemonIndex = 0;
let currentFilteredIndex = 0;

/**
 * Open the modal with Pokemon information
 * @param {number} index - Pokemon index
 * @param {string} abilities - Abilities
 * @param {number} height - Height
 * @param {number} weight - Weight
 * @param {Object} hpAttackDefense - Stats
 */
function openPokemonModal(index, abilities, height, weight, hpAttackDefense) {
  const pokemon = pokedexData[index];
  currentPokemonIndex = index;
  if (isFiltering) {
    currentFilteredIndex = findIndexInFilteredData(index);
  }
  document.getElementById("modal-container").innerHTML = renderPokemonModal(
    pokemon, abilities, height, weight, hpAttackDefense
  );
  document.body.classList.add("modal-open");
}

/**
 * Close the Pokémon modal
 */
function closePokemonModal() {
  document.getElementById("modal-container").innerHTML = "";
  document.body.classList.remove("modal-open");
  currentFilteredIndex = 0;
  currentPokemonIndex = 0;
}

/**
 * Navigate to next/previous Pokemon
 * @param {string} direction - 'next' or 'previous'
 */
function nextPokemon(direction) {
  if (isFiltering) {
    navigateFilteredPokemon(direction);
  } else {
    navigateAllPokemon(direction);
  }
}

/**
 * Navigate to next or previous Pokemon in filtered list
 * @param {string} direction - Navigation direction ('next' or 'previous')
 */
function navigateFilteredPokemon(direction) {
  currentFilteredIndex += (direction === "previous" ? -1 : 1);
  if (currentFilteredIndex >= filteredPokedexData.length) currentFilteredIndex = 0;
  if (currentFilteredIndex < 0) currentFilteredIndex = filteredPokedexData.length - 1;
  loadPokemonModalBaseData(filteredPokedexData[currentFilteredIndex].originalIndex);
}

/**
 * Navigate to next or previous Pokemon in complete list
 * @param {string} direction - Navigation direction ('next' or 'previous')
 */
function navigateAllPokemon(direction) {
  currentPokemonIndex += (direction === "previous" ? -1 : 1);
  if (currentPokemonIndex >= pokedexData.length) currentPokemonIndex = 0;
  if (currentPokemonIndex < 0) currentPokemonIndex = pokedexData.length - 1;
  loadPokemonModalBaseData(currentPokemonIndex);
}

/**
 * Load and display Pokemon modal with base data
 * @param {number} index - Index of the Pokemon in pokedexData array
 */
function loadPokemonModalBaseData(index) {
  const pokemon = pokedexData[index];
  openPokemonModal(index, pokemon.abilities, pokemon.height, pokemon.weight, pokemon.hpAttackDefense);
}

/**
 * Find the index of a Pokemon in the filtered data array
 * @param {number} originalIndex - The original index in pokedexData
 * @returns {number} The index in filteredPokedexData, or 0 if not found
 */
function findIndexInFilteredData(originalIndex) {
  for (let index = 0; index < filteredPokedexData.length; index++) {
    if (filteredPokedexData[index].originalIndex === originalIndex) return index;
  }
  return 0;
}