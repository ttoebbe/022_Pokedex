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
  // localStorage.setItem("pokedexData", JSON.stringify(data)); // Daten im lokalen Speicher speichern
}

//Pokémon-Details von der API holen

async function loadPokemonDetails() {
  // "async" kennzeichnet die Funktion als asynchron, sodass wir innerhalb await verwenden können;
  // das erlaubt uns, auf asynchrone Operationen (hier: fetch) zu warten, ohne Callbacks zu verschachteln.

  for (let i = 0; i < pokedexData.length; i++) {
    // klassische for-Schleife: wir iterieren indexbasiert über das Array "pokedexData".
    // Vorteil: einfache Kontrolle des Indexes, späteres Überschreiben des gleichen Slots möglich.

    const entry = pokedexData[i];
    // Wir lesen das aktuelle Element aus dem Array in die Konstante "entry".
    // Vor dem Ersetzen enthält "entry" typischerweise nur { name, url } (die erste API-Antwort).
    // Wir behalten den ursprünglichen Namen aus "entry.name", weil das später in das Snapshot-Objekt übernommen wird.

    const details = await fetch(entry.url).then((response) =>
      response.json(),
    );
    // Wir führen einen HTTP-Request an die URL des jeweiligen Pokémon (entry.url) aus.
    // fetch(...) gibt ein Promise zurück; durch "await" pausiert die Ausführung, bis das Promise erfüllt ist.
    // .then((response) => response.json()) wandelt die Antwort in ein JSON-Objekt um; "details" enthält dann das volle Pokémon-Objekt vom /pokemon/{id}-Endpoint.

    pokedexData[i] = {
      // Hier ersetzen wir das ursprüngliche Element im Array durch ein minimales Snapshot-Objekt,
      // das nur die für die List-Ansicht benötigten Felder enthält (kleiner Speicherbedarf).

      id: details.id,
      // Die numerische ID des Pokémon aus dem details-Objekt; praktisch für Anzeige und eindeutige IDs.

      name: entry.name,
      // Wir übernehmen den Namen aus dem ursprünglichen Eintrag (entry.name).
      // Das ist gleichbedeutend mit details.name, aber so bleibt die Absicht klar: Name stammt aus der ursprünglichen Liste.

      sprite: details.sprites.front_default,
      // URL zum Front-Sprite (kleines, zuverlässiges PNG). Für List-Views ist front_default meist vorhanden und ausreichend.
      // Wir speichern nur diese URL, nicht das gesamte sprites-Objekt, um Platz zu sparen.

      abilities: details.abilities.map((a) => a.ability.name),
      // abilities ist ein Array von Strings: wir wandeln das details.abilities-Array in ein einfaches Array mit den Fähigkeits-Namen um.
      // details.abilities hat die Form [{ability: { name, url }, is_hidden, slot}, ...]; wir extrahieren nur ability.name.
    };
    // Nach dieser Zuweisung enthält pokedexData[i] nur noch die minimalen Felder {id, name, sprite, abilities},
    // geeignet für ein schnelles Rendering in der List-Ansicht und für platzsparendes localStorage.
  }
}

// async function loadPokemonDetails() {
//   for (let i = 0; i < pokedexData.length; i++) {
//     let pokemon = pokedexData[i];
//     let details = await fetch(pokemon.url).then((response) => response.json()); // Holen der Details und Umwandeln in JSON
//     pokedexData[i] = { ...pokemon, details };
//   }
// }

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
  // localStorage.removeItem("pokedexData");
  // const snapshot = pokedexData.map((pokemon) => ({
  //   id: pokemon.details.id,
  //   name: pokemon.name,
  //   types: pokemon.details.types.map((typeEntry) => typeEntry.type.name),
  //   sprite: pokemon.details.sprites.front_default,
  //   height: pokemon.details.height,
  //   weight: pokemon.details.weight,
  // }));
  // localStorage.setItem("pokedexData", JSON.stringify(snapshot));

  showLoadingSpinner(false);
  renderPokedexListView();
}
