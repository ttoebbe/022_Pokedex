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
  const response = await fetch(BASE_URL); //nur Name und URL der Pokémon holen
  const data = await response.json();

  pokedexData = data.results; // Daten in die Variable laden
  console.log("Pokémon ohne Details...");
  // console.table(pokedexData);

  await loadPokemonDetails(); //ID (nicht ArrayID), Sprite (Bild) und Fähigkeiten der Pokémon holen
  console.table(pokedexData);
  // localStorage.setItem("pokedexData", JSON.stringify(data)); // Daten im lokalen Speicher speichern
}

//Pokémon-Details von der API holen für das erste Laden
async function loadPokemonDetails() {
  for (let i = 0; i < pokedexData.length; i++) {
    const entry = pokedexData[i];
    const details = await fetch(entry.url).then(
      (response) => response.json(), // Abfrage, und Wandlung der Antwort in ein JSON-Objekt
    );

    pokedexData[i] = {
      // Hier ersetzen wir das ursprüngliche Element im Array durch ein minimales Snapshot-Objekt,
      // das nur die für die List-Ansicht benötigten Felder enthält (kleiner Speicherbedarf).

      id: details.id, // Die numerische ID des Pokémon aus dem details-Objekt! Achtung, nicht der Array-Index i.
      name: entry.name,
      sprite: details.sprites.front_default, // Das Standard-Sprite-Bild des Pokémon
      abilities: details.abilities.map((a) => a.ability.name), // Die Namen der Fähigkeiten als Array von Strings
      color: await getPokemonColor(details.id), // Hintergrundfarbe des Pokémons holen
    };
  }
}

//Im Listview soll die Baggroundcolor der Karte je nach Typ des Pokémons angepasst werden.
async function getPokemonColor(pokemonId) {
  let colorUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
  const response = await fetch(colorUrl);
  const data = await response.json();
  return data.color.name; // Rückgabe der Farbe als String
}

/** 
idee: die BASE_URL mit Parametern für limit und offset dynamisch, je nach größe des 
aktuellen pokedexData Arrays anpassen
somit würde das laden weiterer Pokémon vereinfacht werden, da die gleichen Funktionen genutzt werden können
*/

async function loadMorePokemon() {
  offset = pokedexData.length;
  limit = 5;
  let fetchMoreUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  showLoadingSpinner(true);
  const responseNewPokemon = await fetch(fetchMoreUrl); //nur Name und URL der Pokémon holen
  const dataNewPokemon = await responseNewPokemon.json();
  const newPokemonEntries = dataNewPokemon.results;

  await loadMorePokemonDetails(newPokemonEntries);
  showLoadingSpinner(false);
  renderPokedexListView();
}

async function loadMorePokemonDetails(newPokemonEntries) {
  //für jedes neue Pokémon die Details holen und in das Array einfügen
  for (let i = 0; i < newPokemonEntries.length; i++) {
    const entry = newPokemonEntries[i];
    const details = await fetch(entry.url).then((response) => response.json());

    pokedexData.push({
      // Hier fügen wir ein neues Objekt in das pokedexData-Array ein, durch push wird das Array erweitert
      id: details.id,
      name: entry.name,
      sprite: details.sprites.front_default,
      abilities: details.abilities.map((a) => a.ability.name),
      color: await getPokemonColor(details.id), // Hintergrundfarbe des Pokémons holen
    });
  }
  console.log("Neue Pokémon mit Details geladen:");
  console.table(pokedexData);
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

// Beim Modalaufruf sollen direkt mehr Details des Pokémons
// angezeigt werden, welche aktuell für das Modal geladen werden, aber
// nicht gespeichert werden
async function loadPokemonModalExtraDetails(currentPokemonIndex) {
  let fetchDetailsUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemonIndex + 1}/`;
  //const entry = pokedexData[currentPokemonIndex];
  const details = await fetch(fetchDetailsUrl).then(
    (response) => response.json(), // Abfrage, und Wandlung der Antwort in ein JSON-Objekt
  );

  const types = details.types.map((t) => t.type.name).join(", ");
  const height = details.height / 10; // Dezimeter -> Meter
  const weight = details.weight / 10; // Hektogramm -> kg

  openPokemonModal(currentPokemonIndex, types, height, weight);
}
