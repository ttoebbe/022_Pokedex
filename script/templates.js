/**
 * Generate HTML for the loading spinner
 * @returns {string} HTML string for the loading spinner
 */
function loadingSpinnerHTML() {
  return /* html */ `
    <div class="loading-spinner-container">
      <div class="loading-spinner">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

/**
 * Generate HTML for a single Pokémon item card
 * @param {Object} pokemon - The Pokémon data object
 * @param {number} index - The index of the Pokémon in the array
 * @returns {string} HTML string for the Pokémon item
 */
function renderPokemonItem(pokemon, index) {
  return /* html */ `
    <article
      class="pokedex-item"
      id="pokemon-${pokemon.id}"
      data-index="${index}"
      onclick="loadPokemonModalBaseData(${index})"
      style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${pokemon.color};"
    >
      <img class="pokemon-img" src="${pokemon.sprite}" alt="${pokemon.name}" />
      <h3 class="pokemon-title" style="color: ${pokemon.textColor}">
        #${pokemon.id} ${pokemon.name}
      </h3>
      <div class="pokemon-types">${renderTypeBadges(pokemon.types)}</div>
    </article>`;
}

/**
 * Generate HTML for the Pokémon modal window
 * @param {Object} pokemon - The Pokémon data object
 * @param {string} abilities - Comma-separated list of abilities
 * @param {number} height - Height of the Pokémon in meters
 * @param {number} weight - Weight of the Pokémon in kilograms
 * @param {Object} hpAttackDefense - Object containing hp, attack, and defense values
 * @returns {string} HTML string for the Pokémon modal
 */
function renderPokemonModal(
  pokemon,
  abilities,
  height,
  weight,
  hpAttackDefense,
) {
  return /* html */ `
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
        <img
          class="modal-pokemon-img"
          src="${pokemon.sprite}"
          alt="${pokemon.name}"
        />
        <h2 class="modal-pokemon-title" style="color: ${pokemon.textColor}">
          #${pokemon.id} ${pokemon.name}
        </h2>
        <div class="pokemon-types">${renderTypeBadges(pokemon.types)}</div>
        <div class="modal-pokemon-details">
          <p style="color: ${pokemon.textColor}">
            <strong>Abilities:</strong> ${abilities}
          </p>
          <p style="color: ${pokemon.textColor}">
            <strong>Height:</strong> ${height} m
          </p>
          <p style="color: ${pokemon.textColor}">
            <strong>Weight:</strong> ${weight} kg
          </p>

          <div class="stat-container" style="color: ${pokemon.textColor}">
            <strong>HP:</strong>
            <div class="progress">
              <div
                class="progress-bar bg-danger"
                role="progressbar"
                style="width: ${hpAttackDefense.hp}%"
              >
                ${hpAttackDefense.hp}
              </div>
            </div>
          </div>

          <div class="stat-container" style="color: ${pokemon.textColor}">
            <strong>Attack:</strong>
            <div class="progress">
              <div
                class="progress-bar bg-warning"
                role="progressbar"
                style="width: ${hpAttackDefense.attack}%"
              >
                ${hpAttackDefense.attack}
              </div>
            </div>
          </div>
          <div class="stat-container" style="color: ${pokemon.textColor}">
            <strong>Defense:</strong>
            <div class="progress">
              <div
                class="progress-bar bg-success"
                role="progressbar"
                style="width: ${hpAttackDefense.defense}%"
              >
                ${hpAttackDefense.defense}
              </div>
            </div>
          </div>

          <div class="modal-button">
            <button class="btn btn-primary" onclick="nextPokemon('previous')">
              ⬅️
            </button>
            <button
              class="close-button btn btn-danger"
              onclick="closePokemonModal()"
            >
              Close
            </button>
            <button class="btn btn-primary" onclick="nextPokemon('next')">
              ➡️
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
