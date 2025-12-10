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

//HTML für eine Pokémon-Karte in der Liste
function getPokemonCardHTML(pokemon, index) {
  const types = pokemon.details.types
    .map((type) => `<span class="type-badge">${type.type.name}</span>`)
    .join("");

  return /* html */ `
    <div
      class="pokedex-item"
      onclick="openPokemonModal(${index})"
    >
      <img
        src="${pokemon.details.sprites.front_default}"
        alt="${pokemon.name}"
      />
      <h3>#${index + 1} ${pokemon.name}</h3>
      <div class="pokemon-types">${types}</div>
      <div class="pokemon-properties">
        <div class="pokemon-property">
          <span class="property-label">Height:</span>
          <span class="property-value">${pokemon.details.height / 10} m</span>
        </div>
        <div class="pokemon-property">
          <span class="property-label">Weight:</span>
          <span class="property-value">${pokemon.details.weight / 10} kg</span>
        </div>
        <div class="pokemon-property">
          <span class="property-label">Experience:</span>
          <span class="property-value">${pokemon.details.base_experience}</span>
        </div>
      </div>
    </div>
  `;
}

//HTML für das Pokémon-Modal
function getPokemonModalHTML(pokemon, index) {
  const types = pokemon.details.types
    .map((type) => `<span class="type-badge">${type.type.name}</span>`)
    .join("");

  return /* html */ `
    <div
      class="pokemon-modal-overlay"
      onclick="closePokemonModal()"
    >
      <div class="pokemon-modal-card" onclick="event.stopPropagation()">
        <img
          src="${pokemon.details.sprites.other["official-artwork"]
            .front_default}"
          alt="${pokemon.name}"
        />
        <h2>#${index + 1} ${pokemon.name}</h2>
        <div class="pokemon-types">${types}</div>
        <div class="pokemon-properties">
          <div class="pokemon-property">
            <span class="property-label">Height:</span>
            <span class="property-value">${pokemon.details.height / 10} m</span>
          </div>
          <div class="pokemon-property">
            <span class="property-label">Weight:</span>
            <span class="property-value"
              >${pokemon.details.weight / 10} kg</span
            >
          </div>
          <div class="pokemon-property">
            <span class="property-label">Experience:</span>
            <span class="property-value"
              >${pokemon.details.base_experience}</span
            >
          </div>

          <div class="modal-button">
            <div>
              <button class="before-button" onclick="beforePokemon()">
                ⬅️
              </button>
            </div>
            <div>
              <button class="close-button" onclick="closePokemonModal()">
                Close
              </button>
            </div>
            <div>
              <button class="next-button" onclick="nextPokemon()">➡️</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
