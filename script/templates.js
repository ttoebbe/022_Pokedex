//HTML für den Lade-Spinner (Bootstrap)
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
  for (let i = 0; i < pokedexData.length; i++) {
    const p = pokedexData[i];
    html += /* html */ `
      <article
        class="pokedex-item"
        id="pokemon-${p.id}"
        data-index="${i}"
        onclick="openPokemonModal(${i})"
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

//Öffnen des Modals mit Pokémon-Details
function openPokemonModal(index) {
  const p = pokedexData[index];
  currentPokemonIndex = index;
  document.getElementById("modal-container").innerHTML = /* html */ `
    <div
      class="pokemon-modal-overlay"
      onclick="closePokemonModal()"
    >
      <div
        class="pokemon-modal-card"
        id="pokemon-modal-${p.id}"
        onclick="event.stopPropagation()"
      >
        <img class="modal-pokemon-img" src="${p.sprite}" alt="${p.name}" />
        <h2 class="modal-pokemon-title">#${p.id} ${p.name}</h2>
        <div class="pokemon-types">
          ${p.abilities
            .map((a) => `<span class="type-badge">${a}</span>`)
            .join("")}
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
