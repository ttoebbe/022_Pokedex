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
  limit = 15;
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
  let fetchDetailsUrl = `https://pokeapi.co/api/v2/pokemon/${currentPokemonIndex + 1}/`;  //plus 1, da die API IDs ab 1 zählt
  //const entry = pokedexData[currentPokemonIndex];
  const details = await fetch(fetchDetailsUrl).then(
    (response) => response.json(), // Abfrage, und Wandlung der Antwort in ein JSON-Objekt
  );

  const types = details.types.map((t) => t.type.name).join(", ");
  const height = details.height / 10; // Dezimeter -> Meter
  const weight = details.weight / 10; // Hektogramm -> kg

  openPokemonModal(currentPokemonIndex, types, height, weight);
}


//Umschalten der Suchmethode zwischen includes und find
let useFilterMethod = false;
function toggleSearchMethod() {
  useFilterMethod = !useFilterMethod;
  const button = document.getElementById("search-switch-include-filter");
  if (useFilterMethod) {
    button.textContent = "Using Filter Method";
  } else {
    button.textContent = "Using Includes Method";
  }
}
// Suchfunktion, die je nach ausgewählter Methode entweder includes oder find verwendet
function searchPokemon() {
  if (useFilterMethod) {
    searchPokemonWithFilter();
  } else {
    searchPokemonWithIncludes();
  }
}





//Suchfunktion für Pokémon im Pokédex
//bei der Eingabe im Suchfeld wird diese Funktion aufgerufen.
//Es wird die pokedexData durchsucht und nur die passenden Pokémon als ListView angezeigt.
// im wesentlichen wird die renderPokedexListView Funktion angepasst, um nur die passenden Pokémon anzuzeigen.
// oninput funktioniert wie onchange, aber schon während der Eingabe, nicht erst danach.
function searchPokemonWithIncludes() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase(); // Suchbegriff in Kleinbuchstaben
  
  if (searchInput.length < 3) {
    //return // Abbrechen, wenn der Suchbegriff weniger als 3 Zeichen hat
    renderPokedexListView(); // Alle Pokémon anzeigen, wenn Suchbegriff zu kurz ist
    return;
  }
  
  const listContainer = document.getElementById("pokedex-container"); // Container für die Pokédex-Liste
  let html = ""; 

  for (let i = 0; i < pokedexData.length; i++) {
    const p = pokedexData[i];
    // Überprüfen, ob der Name oder die ID des Pokémon den Suchbegriff enthält
    if (p.name.toLowerCase().includes(searchInput)) {
      html += /* html */ `
        <article
          class="pokedex-item"
          id="pokemon-${p.id}"
          data-index="${i}"
          onclick="loadPokemonModalExtraDetails(${i})"
          style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${p.color};"
        >
          <img class="pokemon-img" src="${p.sprite}" alt="${p.name}" />
          <h3 class="pokemon-title">#${p.id} ${p.name}</h3>
          <div class="pokemon-types">
            ${p.abilities
              .map((a) => `<span class="type-badge">${a}</span>`)
              .join("")}
          </div>
        </article>`;
    }
  }
  listContainer.innerHTML = html;
}



// Suchfunktion für Pokémon im Pokédex mit find-Methode.
// bei der Eingaben von 3 lettern soll sich ein Dropdown mit den passenden Pokémon öffnen.
//erst beim klick auf ein Pokemon soll das Modal mit den Details geöffnet werden.
function searchPokemonWithFilter() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase(); // Suchbegriff in Kleinbuchstaben
  
  if (searchInput.length < 3) {
    renderPokedexListView(); // Alle Pokémon anzeigen, wenn Suchbegriff zu kurz ist
    return;
  }

  const listContainer = document.getElementById("pokedex-container"); // Container für die Pokédex-Liste
  let html = "";

  const matches = pokedexData.filter((p) => //filtzern des Arrays nach passenden Pokémon
    p.name.toLowerCase().includes(searchInput)  //Filtern geht in einem String nicht mit 
    // filter, daher hier includes nutzen
  );
  console.table("Gefundene Pokémon:", matches);

  //Anzeige der gefundenen Pokémon könnte nun in einem Dropdown erfolgen.
  //oder wir zeigen direkt die passenden Pokémon in der Liste an, wie bei der anderen Suchmethode auch.


  for (let i = 0; i < matches.length; i++) {
    const p = matches[i];
      html += /* html */ `
        <article
          class="pokedex-item"
          id="pokemon-${p.id}"
          data-index="${i}"
          onclick="loadPokemonModalExtraDetails(${i})"
          style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${p.color};"
        > 
          <img class="pokemon-img" src="${p.sprite}" alt="${p.name}" />
          <h3 class="pokemon-title">#${p.id} ${p.name}</h3>
          <div class="pokemon-types">
            ${p.abilities
              .map((a) => `<span class="type-badge">${a}</span>`)
              .join("")}
          </div>
        </article>`;
    }
  
  listContainer.innerHTML = html; 
}









//Achtung, nur zum abschauen und verstehen von Objekten in JS

let myObject = {
  name: "Flo",
  age: 28,
  logJob: function (number) {
    console.log("Dev-Mentor " + number);
  },
  good_guy: true,
};

// console.log(myObject);
// console.log(myObject.name);
// //console.log(myObject.job.company);
// console.log(myObject["name"]);
// let objKey = "age";
// console.log(myObject[objKey]);
console.table(myObject);
//Methoden aufrufen
// myObject.logJob(651);

//Keys und Entries / hier machen wir aus einem Object ein Array
// console.log(Object.keys(myObject));
// console.table(Object.keys(myObject));

// console.log(Object.entries(myObject));
// console.table(Object.entries(myObject));

let objKeys = Object.keys(myObject);
let ourArray = [];

for (let i = 0; i < objKeys.length; i++) {
  const element = objKeys[i];
  ourArray.push(myObject[objKeys[i]]);
}
console.table(ourArray);

//Info Json vs. normales Object
//Json immer mit doppelten Anführungszeichen
let myJson = '{ "name": "Flo", "age": 28, "good_guy": true }';
console.log(myJson);
console.log(typeof myJson); //string


//Filtern in einem Array von Objects
let users = [
  { name: "Flo", age: 28, good_guy: true },
  { name: "Max", age: 32, good_guy: false },
  { name: "Lisa", age: 25, good_guy: true },
];

//Filter für gute Jungs
let goodGuys = users.filter(function (user) {
  return user.good_guy;
});
console.table(goodGuys);

//Filter für schlechte Jungs
let badGuys = users.filter(function (user) {
  return !user.good_guy;
});
console.table(badGuys);

console.log(users.filter((user) => user.age < 30));
console.log(users.filter((user) => user.name === "Max"));

