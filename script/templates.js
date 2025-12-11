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
        id="pokemon-${p.details.id}"
        data-index="${i}"
        onclick="openPokemonModal(${i})"
      >
        <img
          class="pokemon-img"
          src="${p.details.sprites.front_default}"
          alt="${p.name}"
        />
        <h3 class="pokemon-title">#${i + 1} ${p.name}</h3>
        <div class="pokemon-types">
          ${p.details.types
            .map((t) => `<span class="type-badge">${t.type.name}</span>`)
            .join("")}
        </div>
        <div class="pokemon-properties">
          <div class="pokemon-property">
            <span class="property-label">Height:</span
            ><span class="property-value">${p.details.height / 10} m</span>
          </div>
          <div class="pokemon-property">
            <span class="property-label">Weight:</span
            ><span class="property-value">${p.details.weight / 10} kg</span>
          </div>
        </div>
      </article>`;
  }
  listContainer.innerHTML = html;
}


//Öffnen des Modals mit Pokémon-Details
function openPokemonModal(index) {
  const p = pokedexData[index];
  currentPokemonIndex = index; // Aktualisiere den aktuellen Index
  document.getElementById("modal-container").innerHTML = /* html */ `
    <div
      class="pokemon-modal-overlay"
      onclick="closePokemonModal()"
    >
      <div
        class="pokemon-modal-card"
        id="pokemon-modal-${p.details.id}"
        onclick="event.stopPropagation()"
      >
        <img
          class="modal-pokemon-img"
          src="${p.details.sprites.other?.["official-artwork"]?.front_default ||
          p.details.sprites.front_default}"
          alt="${p.name}"
        />
        <h2 class="modal-pokemon-title">#${p.details.id} ${p.name}</h2>
        <div class="pokemon-types">
          ${p.details.types
            .map((t) => `<span class="type-badge">${t.type.name}</span>`)
            .join("")}
        </div>
        <div class="pokemon-properties">
          <div class="pokemon-property">
            <span class="property-label">Height:</span
            ><span class="property-value">${p.details.height / 10} m</span>
          </div>
          <div class="pokemon-property">
            <span class="property-label">Weight:</span
            ><span class="property-value">${p.details.weight / 10} kg</span>
          </div>
          <div class="pokemon-property">
            <span class="property-label">Base XP:</span
            ><span class="property-value">${p.details.base_experience}</span>
          </div>
        </div>
        <div class="modal-button">
          <div>
            <button
              class="btn btn-primary"
              onclick="previousPokemon()"
            >
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
            <button class="btn btn-primary" onclick="nextPokemon()">
              ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

