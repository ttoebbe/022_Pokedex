const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

let currentPokemonIndex = 0;

async function onloadInit() {
  showLoadingSpinner(true); // Ladeanzeige zeigen
  await loadLocalData(); // Initiale Daten laden
  showLoadingSpinner(false); // Ladeanzeige verbergen
  renderPokedexListView(); // Pokédex-Liste rendern
}

//laden initialer Daten aus der API in den lokalen Speicher und in die Variable pokedexData
async function loadLocalData() {
  const response = await fetch(BASE_URL);
  const data = await response.json();

  pokedexData = data.results; // Daten in die Variable laden
  await loadPokemonDetails();
  console.table(pokedexData);
  localStorage.setItem("pokedexData", JSON.stringify(data)); // Daten im lokalen Speicher speichern
}

//Pokémon-Details von der API holen
async function loadPokemonDetails() {
  for (let i = 0; i < pokedexData.length; i++) {
    let pokemon = pokedexData[i];
    let details = await fetch(pokemon.url).then((response) => response.json()); // Holen der Details und Umwandeln in JSON
    pokedexData[i] = { ...pokemon, details };
  }
}

//Staus --> Spinner wird gezeigt / Daten sind geladen und in der Variable und auch im lokalen Speicher

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
function beforePokemon() {
  currentPokemonIndex--;
  if (currentPokemonIndex < 0) {
    currentPokemonIndex = pokedexData.length - 1;
  }
  openPokemonModal(currentPokemonIndex);
}

//Modale Navigation zum nächsten Pokémon
function nextPokemon() {
  currentPokemonIndex++;
  if (currentPokemonIndex >= pokedexData.length) {
    currentPokemonIndex = 0;
  }
  openPokemonModal(currentPokemonIndex);
}

//mehr Pokémon laden und speichern und in die Liste einfügen
async function loadMorePokemon() {
  //URL zu Laufzeit mit Offset anpassen und 10 Pokemon fest hinzu
  const URL_AFTERLOAD = `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${pokedexData.length}`;
  showLoadingSpinner(true);
  let response = await fetch(URL_AFTERLOAD);
  let data = await response.json();
  let newPokemon = data.results;
  // Füge die neuen Pokémon zur Liste hinzu
  for (let i = 0; i < newPokemon.length; i++) {
    let pokemon = newPokemon[i];
    let details = await fetch(pokemon.url).then((response) => response.json());
    pokedexData.push({ ...pokemon, details });
  }

  // Aktualisiere pokedexData im lokalen Speicher
  //localStorage.setItem("pokedexData", JSON.stringify(pokedexData));
  //localStorage nur mit den nötigen Daten füllen, da er nach dem Update überläuft :-(
  // erst entfernen, dann einmalig schreiben (statt in Schleife)
  localStorage.removeItem("pokedexData");
  const snapshot = pokedexData.map((p) => ({
    id: p.details.id,
    name: p.name,
    types: p.details.types.map((t) => t.type.name),
    sprite:
      p.details.sprites.other?.["official-artwork"]?.front_default ||
      p.details.sprites.front_default,
    height: p.details.height,
    weight: p.details.weight,
  }));
  localStorage.setItem("pokedexData", JSON.stringify(snapshot));

  showLoadingSpinner(false);
  renderPokedexListView();
}
