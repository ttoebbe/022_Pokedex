const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

let currentPokemonIndex = 0;

async function onloadInit() {
  showLoadingSpinner(true);
  await loadLocalData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

// Load initial data from the API into local storage and into the pokedexData variable
async function loadLocalData() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  pokedexData = data.results;
  await loadPokemonDetails();
}

// Fetch Pokémon details from the API for initial load
async function loadPokemonDetails() {
  for (let i = 0; i < pokedexData.length; i++) {
    const entry = pokedexData[i];
    const details = await fetch(entry.url).then((response) => response.json());
    pokedexData[i] = {
      id: details.id,
      name: entry.name.toUpperCase(),
      sprite: details.sprites.front_default,
      types: details.types.map((typeObj) => typeObj.type.name),
      color: await getPokemonColor(details.id),
    };
  }
}

// In list view, the background color of the card should be adjusted according to the Pokémon's type
async function getPokemonColor(pokemonId) {
  let colorUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  const response = await fetch(colorUrl);
  const data = await response.json();
  return data.color.name;
}

// Load more Pokémon and append to the existing list
async function loadMorePokemon() {
  const offset = pokedexData.length;
  const limit = 20;
  let fetchMoreUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  showLoadingSpinner(true);
  const responseNewPokemon = await fetch(fetchMoreUrl);
  const dataNewPokemon = await responseNewPokemon.json();
  const newPokemonEntries = dataNewPokemon.results;

  await loadMorePokemonDetails(newPokemonEntries);
  showLoadingSpinner(false);
  renderPokedexListView();
}

// Load more Pokémon details and append to the existing list
async function loadMorePokemonDetails(newPokemonEntries) {
  for (
    let entryIndex = 0;
    entryIndex < newPokemonEntries.length; entryIndex++
  ) {
    const entry = newPokemonEntries[entryIndex];
    const details = await fetch(entry.url).then((response) => response.json());
    pokedexData.push({
      id: details.id,
      name: entry.name.toUpperCase(),
      sprite: details.sprites.front_default,
      types: details.types.map((typeObj) => typeObj.type.name),
      color: await getPokemonColor(details.id),
    });
  }
}

// Show/hide loading indicator
function showLoadingSpinner(isLoading) {
  let overlay = document.getElementById("loading-overlay");
  if (isLoading) {
    overlay.classList.remove("d-none");
  } else {
    overlay.classList.add("d-none");
  }
}

// Close the Pokémon modal
function closePokemonModal() {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";
  document.body.classList.remove("modal-open");
}

// Modal navigation to previous Pokémon
function previousPokemon() {
  currentPokemonIndex--;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = pokedexData.length - 1;
  }
  loadPokemonModalExtraDetails(currentPokemonIndex);
}

// Modal navigation to next Pokémon
function nextPokemon() {
  currentPokemonIndex++;
  if (currentPokemonIndex >= pokedexData.length) {
    currentPokemonIndex = 0;
  }
  loadPokemonModalExtraDetails(currentPokemonIndex);
}

// Load additional details for the Pokémon modal
async function loadPokemonModalExtraDetails(currentPokemonIndex) {
  let fetchDetailsUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemonIndex + 1}/`;
  const details = await fetch(fetchDetailsUrl).then((response) =>
    response.json(),
  );
  const abilities = extractPokemonAbilities(details);
  const height = details.height / 10;
  const weight = details.weight / 10;
  const hpAttackDefense = extractPokemonStats(details);
  openPokemonModal(
    currentPokemonIndex,
    abilities,
    height,
    weight,
    hpAttackDefense,
  );
}

// Extract hp, attack and defense, as these should now also be displayed on the modal
function extractPokemonStats(details) {
  let stats = {};
  for (let indexStats = 0; indexStats < details.stats.length; indexStats++) {
    const statName = details.stats[indexStats].stat.name;
    const statValue = details.stats[indexStats].base_stat;
    stats[statName] = statValue;
    if (statName === "hp") {
      stats["hp"] = statValue;}
    if (statName === "attack") {
      stats["attack"] = statValue;}
    if (statName === "defense") {
      stats["defense"] = statValue;}
  }
  return stats;
}

// Extract type names
function extractPokemonTypes(details) {
  let types = [];
  for (let i = 0; i < details.types.length; i++) {
    types.push(details.types[i].type.name);
  }
  return types.join(", ");
}

// Initial display of the Pokédex list
function renderPokedexListView() {
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  for (let index = 0; index < pokedexData.length; index++) {
    html += renderPokemonItem(pokedexData[index], index);
  }
  listContainer.innerHTML = html;
}

// Open the modal with Pokémon details
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

// Helper function to render type badges
function renderTypeBadges(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += `<span class="type-badge"> ${types[i]}</span>`;
  }
  return html;
}

// Extract ability names
function extractPokemonAbilities(details) {
  let abilities = [];
  for (let i = 0; i < details.abilities.length; i++) {
    abilities.push(details.abilities[i].ability.name);
  }
  return abilities.join(", ");
}

// Search function for Pokémon in the Pokedex
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  toggleClearButton(searchInput);

  if (searchInput.length < 3) {
    renderPokedexListView();
    return;
  }
  renderFilteredPokemon(searchInput);
}

// Show/hide clear button
function toggleClearButton(searchInput) {
  const clearBtn = document.getElementById("clear-search-btn");
  if (searchInput.length > 0) {
    clearBtn.classList.remove("d-none");
  } else {
    clearBtn.classList.add("d-none");
  }
}

// Render filtered Pokemon list
function renderFilteredPokemon(searchInput) {
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  for (let index = 0; index < pokedexData.length; index++) {
    if (pokedexData[index].name.toLowerCase().includes(searchInput)) {
      html += renderPokemonItem(pokedexData[index], index);
    }
  }
  if (html.length === 0) {
    html = "<p>No Pokemon found.</p>";
  }
  listContainer.innerHTML = html;
}

// Clear search field
function clearSearch() {
  document.getElementById("search-bar").value = "";
  document.getElementById("clear-search-btn").classList.add("d-none");
  renderPokedexListView();
}
