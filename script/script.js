const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const API_URL_LIMITED = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=0";

function onloadInit() {
  showLoadingSpinner(true);
  loadLocalData();
}

//laden der Pokemon-Daten aus der API (Index, Name, URL)
async function loadLocalData() {
  //let isLoading = true; // Ladezustand setzen für Ladeanzeige
  pokedexData = await fetch(API_URL_LIMITED)
    .then((response) => response.json()) // konvertiere Antwort in JSON
    .then((data) => data.results) // extrahiere das results-Array
    .catch((error) => console.error("Error loading local data:", error)) // protokolliere alle Fehler
    .finally(() => {
      // wird immer ausgeführt, egal ob Erfolg oder Fehler / erfolgt erst nach allen then/catch
      isLoading = false; // Ladezustand zurücksetzen
    });
  console.table(pokedexData);
  loadPokemonDetails(); // Rufe die Funktion zum Laden der Pokémon-Details auf
}


//Details eines einzelnen Pokémons holen
async function fetchPokemonDetails(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error("Error fetching pokemon details:", error));
}


//Details für jedes Pokémon laden (Bildurl, Typ, Fähigkeiten, etc.)
async function loadPokemonDetails() {
  for (let i = 0; i < pokedexData.length; i++) {
    let pokemon = pokedexData[i];
    let details = await fetchPokemonDetails(pokemon.url); //Achtung, hier iterieren wir über jedes Pokémon und holen die Details
    pokedexData[i] = { ...pokemon, details }; // Füge die Details zum Pokémon-Objekt hinzu, durch die dreipunkt-Syntax wird ein neues Objekt erstellt
  }
  console.table(pokedexData); // Protokolliere die aktualisierten Daten mit Details
  showLoadingSpinner(false);
  renderPokedexListView(); // Rufe die Funktion zum Rendern der Liste auf
  //isLoading = false; // Ladezustand zurücksetzen
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

//Rendern der Pokédex-Liste in der HTML-Seite
function renderPokedexListView() {
  let listContainer = document.getElementById("pokedex-container");
  listContainer.innerHTML = ""; // Leere den Container vor dem Rendern

  pokedexData.forEach((pokemon, index) => {
    listContainer.innerHTML += getPokemonCardHTML(pokemon, index);
    // Iteriere über jedes Pokémon im Array
    // let listItem = document.createElement("div"); // Erstelle ein neues Div-Element für jedes Pokémon
    // listItem.className = "pokedex-item"; // Füge eine Klasse für Styling hinzu
    // //Bild und Namen
    // //listItem.innerText = `${index + 1}. ${pokemon.name}`; // Setze den Text des Elements auf den Namen des Pokémon

    // //HTML-Inhalt mit Bild und Name
    // listItem.innerHTML = `
    //   <img src="${pokemon.details.sprites.front_default}" alt="${pokemon.name}">
    //   <p>${index + 1}. ${pokemon.name}</p>
    // `;

    // listContainer.appendChild(listItem); // Füge das Element dem Container hinzu
  });
}

//Öffnen des Modals mit Pokémon-Details
function openPokemonModal(index) {
  const pokemon = pokedexData[index];
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = getPokemonModalHTML(pokemon, index);
}

//Schließen des Pokémon-Modals
function closePokemonModal() {
  const modalContainer = document.getElementById("modal-container");
  modalContainer.innerHTML = "";
}
