const pokedexData = [];

const BASE_URL = "https://pokeapi.co/api/v2/";
const LIMIT_URL = "pokemon?limit=";
const limit = 21;
const OFFSET_URL = "&offset=";
let offset = 0;
const COLOR_URL = "pokemon-species/";
const EXTRA_DETAILS_URL = "pokemon/";

let filteredPokedexData = [];
let currentFilteredIndex = 0;
let isFiltering = false;

let currentPokemonIndex = 0;

/**
 * Map of background colors to their corresponding text colors for optimal contrast
 * @type {Object.<string, string>}
 */
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
 * Initial load of Pokémon data on page load
 * @async
 * @returns {Promise<void>}
 */
async function onloadInit() {
  showLoadingSpinner(true);
  await loadPokemonBaseData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

/**
 * Load more Pokémon and append to the existing list
 * @async
 * @returns {Promise<void>}
 */
async function loadMorePokemon() {
  showLoadingSpinner(true);
  await loadPokemonBaseData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

/**
 * Load initial data from the API into local storage and into the pokedexData variable
 * @async
 * @returns {Promise<void>}
 */
async function loadPokemonBaseData() {
  const response = await fetch(
    BASE_URL + LIMIT_URL + limit + OFFSET_URL + offset,
  );
  const data = await response.json();
  const newEntries = data.results;
  await loadPokemonDetails(newEntries);
  offset += limit;
}

/**
 * Fetch Pokémon details from the API for initial load
 * @async
 * @param {Array<Object>} newEntries - Array of Pokémon entries with name and url
 * @returns {Promise<void>}
 */
async function loadPokemonDetails(newEntries) {
  for (let i = 0; i < newEntries.length; i++) {
    const entry = newEntries[i];
    const details = await fetch(entry.url).then((response) => response.json());
    const pokemonColor = await getPokemonColor(details.id);
    pokedexData.push({
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
    });
  }
}

/**
 * Get text color based on background color for optimal contrast
 * @param {string} backgroundColor - The background color name
 * @returns {string} The corresponding text color in hex format
 */
function textColorMapper(backgroundColor) {
  return COLOR_CONTRAST_MAP[backgroundColor] || "#000000";
}

/**
 * Fetch the background color of a Pokémon based on its species
 * @async
 * @param {number} pokemonId - The ID of the Pokémon
 * @returns {Promise<string>} The color name of the Pokémon
 */
async function getPokemonColor(pokemonId) {
  const response = await fetch(BASE_URL + COLOR_URL + pokemonId + "/");
  const data = await response.json();
  return data.color.name;
}

/**
 * Show or hide the loading spinner overlay
 * @param {boolean} isLoading - Whether to show (true) or hide (false) the spinner
 * @returns {void}
 */
function showLoadingSpinner(isLoading) {
  let overlay = document.getElementById("loading-overlay");
  if (isLoading) {
    overlay.classList.remove("d-none");
  } else {
    overlay.classList.add("d-none");
  }
}

/**
 * Close the Pokémon modal and reset state
 * @returns {void}
 */
function closePokemonModal() {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";
  document.body.classList.remove("modal-open");
  currentFilteredIndex = 0;
  currentPokemonIndex = 0;
}

/**
 * Navigate to the previous Pokémon in the modal
 * @returns {void}
 */
function previousPokemon() {
  if (isFiltering) {
    currentFilteredIndex--;
    if (currentFilteredIndex < 0) {
      currentFilteredIndex = filteredPokedexData.length - 1;
    }
    loadPokemonModalBaseData(
      filteredPokedexData[currentFilteredIndex].originalIndex,
    );
    return;
  }
  currentPokemonIndex--;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = pokedexData.length - 1;
  }
  loadPokemonModalBaseData(currentPokemonIndex);
}

/**
 * Navigate to the next Pokémon in the modal
 * @returns {void}
 */
function nextPokemon() {
  if (isFiltering) {
    currentFilteredIndex++;
    if (currentFilteredIndex >= filteredPokedexData.length) {
      currentFilteredIndex = 0;
    }
    loadPokemonModalBaseData(
      filteredPokedexData[currentFilteredIndex].originalIndex,
    );
    return;
  }
  currentPokemonIndex++;
  if (currentPokemonIndex >= pokedexData.length) {
    currentPokemonIndex = 0;
  }
  loadPokemonModalBaseData(currentPokemonIndex);
}

/**
 * Load additional details for the Pokémon modal
 * @param {number} index - The index of the Pokémon in the pokedexData array
 * @returns {void}
 */
function loadPokemonModalBaseData(index) {
  const pokemon = pokedexData[index];
  openPokemonModal(
    index,
    pokemon.abilities,
    pokemon.height,
    pokemon.weight,
    pokemon.hpAttackDefense,
  );
}

/**
 * Extract HP, Attack and Defense stats from Pokémon details
 * @param {Object} details - The detailed Pokémon data from the API
 * @returns {Object} Object containing hp, attack, and defense values
 */
function extractPokemonStats(details) {
  let stats = {};
  for (let indexStats = 0; indexStats < details.stats.length; indexStats++) {
    const statName = details.stats[indexStats].stat.name;
    const statValue = details.stats[indexStats].base_stat;
    stats[statName] = statValue;
    if (statName === "hp") {
      stats["hp"] = statValue;
    }
    if (statName === "attack") {
      stats["attack"] = statValue;
    }
    if (statName === "defense") {
      stats["defense"] = statValue;
    }
  }
  return stats;
}

/**
 * Extract type names from Pokémon details
 * @param {Object} details - The detailed Pokémon data from the API
 * @returns {string} Comma-separated list of type names
 */
function extractPokemonTypes(details) {
  let types = [];
  for (let i = 0; i < details.types.length; i++) {
    types.push(details.types[i].type.name);
  }
  return types.join(", ");
}

/**
 * Render the complete Pokédex list view
 * @returns {void}
 */
function renderPokedexListView() {
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  for (let index = 0; index < pokedexData.length; index++) {
    html += renderPokemonItem(pokedexData[index], index);
  }
  listContainer.innerHTML = html;
}

/**
 * Open the modal with detailed Pokémon information
 * @param {number} index - The index of the Pokémon in the pokedexData array
 * @param {string} abilities - Comma-separated list of abilities
 * @param {number} height - Height of the Pokémon in meters
 * @param {number} weight - Weight of the Pokémon in kilograms
 * @param {Object} hpAttackDefense - Object containing hp, attack, and defense values
 * @returns {void}
 */
function openPokemonModal(index, abilities, height, weight, hpAttackDefense) {
  const pokemon = pokedexData[index];
  currentPokemonIndex = index;
  document.getElementById("modal-container").innerHTML = renderPokemonModal(
    pokemon,
    abilities,
    height,
    weight,
    hpAttackDefense,
  );
  document.body.classList.add("modal-open");
}

/**
 * Render type badges HTML for a Pokémon
 * @param {Array<string>} types - Array of type names
 * @returns {string} HTML string containing all type badges
 */
function renderTypeBadges(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += `<span class="type-badge"> ${types[i]}</span>`;
  }
  return html;
}

/**
 * Extract ability names from Pokémon details
 * @param {Object} details - The detailed Pokémon data from the API
 * @returns {string} Comma-separated list of ability names
 */
function extractPokemonAbilities(details) {
  let abilities = [];
  for (let i = 0; i < details.abilities.length; i++) {
    abilities.push(details.abilities[i].ability.name);
  }
  return abilities.join(", ");
}

/**
 * Search for Pokémon in the Pokedex based on user input
 * @returns {void}
 */
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  const message = document.getElementById("search-message");
  toggleClearButton(searchInput);

  if (searchInput.length > 0 && searchInput.length < 3) {
    message.textContent = " 3 characters required";
    message.classList.remove("d-none");
    isFiltering = false;
    filteredPokedexData = [];
    return;
  } else {
    message.classList.add("d-none");
  }

  if (searchInput.length >= 3) {
    isFiltering = true;
    renderFilteredPokemon(searchInput);
  } else {
    isFiltering = false;
    filteredPokedexData = [];
    renderPokedexListView();
  }
  toggleVisibilityMorePokemonButton();
}

/**
 * Show or hide the clear search button
 * @param {string} searchInput - The current search input value
 * @returns {void}
 */
function toggleClearButton(searchInput) {
  const clearBtn = document.getElementById("clear-search-btn");
  if (searchInput.length > 0) {
    clearBtn.classList.remove("d-none");
  } else {
    clearBtn.classList.add("d-none");
  }
}

/**
 * Render filtered Pokémon list based on search input
 * @param {string} searchInput - The search query to filter Pokémon
 * @returns {void}
 */
function renderFilteredPokemon(searchInput) {
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  filteredPokedexData = [];
  for (let index = 0; index < pokedexData.length; index++) {
    if (pokedexData[index].name.toLowerCase().includes(searchInput)) {
      html += renderPokemonItem(pokedexData[index], index);
      filteredPokedexData.push({
        ...pokedexData[index],
        originalIndex: index,
      });
    }
  }
  if (html.length === 0) {
    html = "<p>No Pokemon found.</p>";
  }
  listContainer.innerHTML = html;
}

/**
 * Clear the search field and reset the view
 * @returns {void}
 */
function clearSearch() {
  document.getElementById("search-bar").value = "";
  document.getElementById("clear-search-btn").classList.add("d-none");
  renderPokedexListView();
  isFiltering = false;
  filteredPokedexData = [];
  toggleVisibilityMorePokemonButton();
}

/**
 * Show or hide the "Load More" button based on filtering state
 * @returns {void}
 */
function toggleVisibilityMorePokemonButton() {
  const morePokemonBtn = document.getElementById("more-pokemon-btn");
  if (isFiltering) {
    morePokemonBtn.classList.add("d-none");
  } else {
    morePokemonBtn.classList.remove("d-none");
  }
}
