//HTML für den Lade-Spinner
function loadingSpinnerHTML() {
  return /* html */ `
    <div
      class="d-flex justify-content-center align-items-center"
      style="min-height: 300px;"
    >
      <div
        class="spinner-border text-warning"
        role="status"
        style="width: 4rem; height: 4rem;"
      >
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
    const pokemon = pokedexData[index];
    html += /* html */ `
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
          ${pokemon.abilities
            .map((ability) => `<span class="type-badge">${ability}</span>`)
            .join("")}
        </div>
      </article>`;
  }
  listContainer.innerHTML = html;
}

//Öffnen des Modals mit Pokémon-Details
function openPokemonModal(index, types, height, weight) {
  const pokemon = pokedexData[index];
  currentPokemonIndex = index;
  document.getElementById("modal-container").innerHTML = /* html */ `
    <div
      class="pokemon-modal-overlay"
      onclick="closePokemonModal()"
    >
      <div
        class="pokemon-modal-card"
        id="pokemon-modal-${pokemon.id}"
        onclick="event.stopPropagation()"
        style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${pokemon.color};"
      >
        <img class="modal-pokemon-img" src="${pokemon.sprite}" alt="${pokemon.name}" />
        <h2 class="modal-pokemon-title">#${pokemon.id} ${pokemon.name}</h2>
        <div class="pokemon-types">
          ${pokemon.abilities
            .map((ability) => `<span class="type-badge">${ability}</span>`)
            .join("")}
        </div>
        <div class="modal-pokemon-details">
          <p><strong>Types:</strong> ${types}</p>
          <p><strong>Height:</strong> ${height} m</p>
          <p><strong>Weight:</strong> ${weight} kg</p>
        </div>
        <div class="modal-button">
          <div>
            <button class="btn btn-primary" onclick="previousPokemon()">
              ⬅️
            </button>
          </div>
          <div>
            <button
              class="close-button btn btn-danger"
              onclick="closePokemonModal()"
            >
              Close
            </button>
          </div>
          <div>
            <button class="btn btn-primary" onclick="nextPokemon()">➡️</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Suchfunktion für Pokémon im Pokédex.
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  if (searchInput.length < 3) {
    renderPokedexListView();
    return;
  }
  const listContainer = document.getElementById("pokedex-container");
  let html = "";

  for (let index = 0; index < pokedexData.length; index++) {
    const pokemon = pokedexData[index];
    if (pokemon.name.toLowerCase().includes(searchInput)) {
      html += /* html */ `
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
            ${pokemon.abilities
              .map((ability) => `<span class="type-badge">${ability}</span>`)
              .join("")}
          </div>
        </article>`;
    }
  }
  listContainer.innerHTML = html;
}

