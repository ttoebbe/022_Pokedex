// HTML für den Lade-Spinner
function loadingSpinnerHTML() {
  return /* html */ `
    <div class="loading-spinner-container">
      <div class="loading-spinner">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
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

// HTML für ein einzelnes Pokémon-Item
function renderPokemonItem(pokemon, index) {
  return /* html */ `
    <article
      class="pokedex-item"
      id="pokemon-${pokemon.id}"
      data-index="${index}"
      onclick="loadPokemonModalExtraDetails(${index})"
      style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${pokemon.color};"
    >
      <img class="pokemon-img" src="${pokemon.sprite}" alt="${pokemon.name}" />
      <h3 class="pokemon-title">#${pokemon.id} ${pokemon.name}</h3>
      <div class="pokemon-types">
        ${renderAbilitiesBadges(pokemon.abilities)}
      </div>
    </article>`;
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

// Öffnen des Modals mit Pokémon-Details
function openPokemonModal(index, types, height, weight) {
  const pokemon = pokedexData[index];
  currentPokemonIndex = index;
  document.getElementById("modal-container").innerHTML = renderPokemonModal(pokemon, types, height, weight);
}

// HTML für das Modal-Fenster
function renderPokemonModal(pokemon, types, height, weight) {
  return /* html */ `
    <div class="pokemon-modal-overlay" onclick="closePokemonModal()">
      <div class="pokemon-modal-card" id="pokemon-modal-${pokemon.id}" onclick="event.stopPropagation()" style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${pokemon.color};">
        <img class="modal-pokemon-img" src="${pokemon.sprite}" alt="${pokemon.name}" />
        <h2 class="modal-pokemon-title">#${pokemon.id} ${pokemon.name}</h2>
        <div class="pokemon-types">${renderAbilitiesBadges(pokemon.abilities)}</div>
        <div class="modal-pokemon-details">
          <p><strong>Types:</strong> ${types}</p>
          <p><strong>Height:</strong> ${height} m</p>
          <p><strong>Weight:</strong> ${weight} kg</p>
        </div>
        <div class="modal-button">
          <button class="btn btn-primary" onclick="previousPokemon()">⬅️</button>
          <button class="close-button btn btn-danger" onclick="closePokemonModal()">Close</button>
          <button class="btn btn-primary" onclick="nextPokemon()">➡️</button>
        </div>
      </div>
    </div>
  `;
}


