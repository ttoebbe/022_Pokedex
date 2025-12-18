const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

let currentPokemonIndex = 0;

async function onloadInit() {
  showLoadingSpinner(true);
  await loadLocalData();
  showLoadingSpinner(false);
  renderPokedexListView();
}

//laden initialer Daten aus der API in den lokalen Speicher und in die Variable pokedexData
async function loadLocalData() {
  const response = await fetch(BASE_URL);
  const data = await response.json();
  pokedexData = data.results;
  await loadPokemonDetails();
}

//Pokémon-Details von der API holen für das erste Laden
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

//Im Listview soll die Baggroundcolor der Karte je nach Typ des Pokémons angepasst werden.
async function getPokemonColor(pokemonId) {
  let colorUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  const response = await fetch(colorUrl);
  const data = await response.json();
  return data.color.name;
}

//Mehr Pokémon laden und an die bestehende Liste anhängen
async function loadMorePokemon() {
  offset = pokedexData.length;
  limit = 20;
  let fetchMoreUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  showLoadingSpinner(true);
  const responseNewPokemon = await fetch(fetchMoreUrl);
  const dataNewPokemon = await responseNewPokemon.json();
  const newPokemonEntries = dataNewPokemon.results;

  await loadMorePokemonDetails(newPokemonEntries);
  showLoadingSpinner(false);
  renderPokedexListView();
}

//Mehr Pokémon-Details laden und an die bestehende Liste anhängen
async function loadMorePokemonDetails(newPokemonEntries) {
  for (
    let entryIndex = 0;
    entryIndex < newPokemonEntries.length;
    entryIndex++
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

//Ladeanzeige anzeigen/verbergen
function showLoadingSpinner(isLoading) {
  let overlay = document.getElementById("loading-overlay");
  if (isLoading) {
    overlay.classList.remove("d-none");
  } else {
    overlay.classList.add("d-none");
  }
}

//Schließen des Pokémon-Modals
function closePokemonModal() {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";
  document.body.classList.remove("modal-open");
}

//Modale Navigation zum vorherigen Pokémon
function previousPokemon() {
  currentPokemonIndex--;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = pokedexData.length - 1;
  }
  loadPokemonModalExtraDetails(currentPokemonIndex);
}

//Modale Navigation zum nächsten Pokémon
function nextPokemon() {
  currentPokemonIndex++;
  if (currentPokemonIndex >= pokedexData.length) {
    currentPokemonIndex = 0;
  }
  loadPokemonModalExtraDetails(currentPokemonIndex);
}

// Laden zusätzlicher Details für das Pokémon-Modale
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

//hp, attack und defense extrahieren, da diese nun auch mit auf das Modal sollen
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
  console.table(stats);
  return stats;
}

// Extrahieren der Typen-Namen
function extractPokemonTypes(details) {
  let types = [];
  for (let i = 0; i < details.types.length; i++) {
    types.push(details.types[i].type.name);
  }
  return types.join(", ");
}

// Initiale Anzeige der Pokédex-Liste
function renderPokedexListView() {
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  for (let index = 0; index < pokedexData.length; index++) {
    html += renderPokemonItem(pokedexData[index], index);
  }
  listContainer.innerHTML = html;
}

// Öffnen des Modals mit Pokémon-Details
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

// Hilfsfunktion zum Rendern der Type-Badges
function renderTypeBadges(types) {
  let html = "";
  for (let i = 0; i < types.length; i++) {
    html += `<span class="type-badge"> ${types[i]}</span>`;
  }
  return html;
}

// Extrahieren der Ability-Namen
function extractPokemonAbilities(details) {
  let abilities = [];
  for (let i = 0; i < details.abilities.length; i++) {
    abilities.push(details.abilities[i].ability.name);
  }
  return abilities.join(", ");
}

// Suchfunktion für Pokémon im Pokedex
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  toggleClearButton(searchInput);

  if (searchInput.length < 3) {
    renderPokedexListView();
    return;
  }
  renderFilteredPokemon(searchInput);
}

// Clear-Button anzeigen/verstecken
function toggleClearButton(searchInput) {
  const clearBtn = document.getElementById("clear-search-btn");
  if (searchInput.length > 0) {
    clearBtn.classList.remove("d-none");
  } else {
    clearBtn.classList.add("d-none");
  }
}

// Gefilterte Pokemon-Liste rendern
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

// Suchfeld leeren
function clearSearch() {
  document.getElementById("search-bar").value = "";
  document.getElementById("clear-search-btn").classList.add("d-none");
  renderPokedexListView();
}
