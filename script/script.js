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
      name: entry.name,
      sprite: details.sprites.front_default,
      abilities: details.abilities.map((a) => a.ability.name),
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
  for (let i = 0; i < newPokemonEntries.length; i++) {
    const entry = newPokemonEntries[i];
    const details = await fetch(entry.url).then((response) => response.json());
    pokedexData.push({
      id: details.id,
      name: entry.name,
      sprite: details.sprites.front_default,
      abilities: details.abilities.map((a) => a.ability.name),
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
  const types = details.types.map((t) => t.type.name).join(", ");
  const height = details.height / 10;
  const weight = details.weight / 10;
  openPokemonModal(currentPokemonIndex, types, height, weight);
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
function openPokemonModal(index, types, height, weight) {
  const pokemon = pokedexData[index];
  currentPokemonIndex = index;
  document.getElementById("modal-container").innerHTML = renderPokemonModal(
    pokemon,
    types,
    height,
    weight,
  );
}

// Hilfsfunktion zum Rendern der Fähigkeits-Badges
function renderAbilitiesBadges(abilities) {
  let html = "";
  for (let i = 0; i < abilities.length; i++) {
    html += `<span class="type-badge">${abilities[i]}</span>`;
  }
  return html;
}

// Suchfunktion für Pokémon im Pokédex
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  if (searchInput.length < 3) {
    renderPokedexListView();
    return;
  }
  const listContainer = document.getElementById("pokedex-container");
  let html = "";
  for (let index = 0; index < pokedexData.length; index++) {
    if (pokedexData[index].name.toLowerCase().includes(searchInput)) {
      html += renderPokemonItem(pokedexData[index], index);
    }
  }
  listContainer.innerHTML = html;
}
