// HTML for the loading spinner
function loadingSpinnerHTML() {
  return /* html */ `
    <div class="loading-spinner-container">
      <div class="loading-spinner">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

// HTML for a single Pokémon item
function renderPokemonItem(pokemon, index) {
  return /* html */ `
    <article
      class="pokedex-item"
      id="pokemon-${pokemon.id}"
      data-index="${index}"
      onclick="loadPokemonModalExtraDetails(${index})"
      style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${
        pokemon.color
      };"
    >
      <img class="pokemon-img" src="${pokemon.sprite}" alt="${pokemon.name}" />
      <h3 class="pokemon-title" style="color: ${pokemon.textColor}">#${
    pokemon.id
  } ${pokemon.name}</h3>
      <div class="pokemon-types">${renderTypeBadges(pokemon.types)}</div>
    </article>`;
}

// HTML for the modal window
function renderPokemonModal(
  pokemon,
  abilities,
  height,
  weight,
  hpAttackDefense
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
        style="background: linear-gradient(rgba(255,255,255,0.25), rgba(255,255,255,0.25)), ${
          pokemon.color
        };"
      >
        <img
          class="modal-pokemon-img"
          src="${pokemon.sprite}"
          alt="${pokemon.name}"
        />
        <h2 class="modal-pokemon-title" style="color: ${pokemon.textColor}">#${
    pokemon.id
  } ${pokemon.name}</h2>
        <div class="pokemon-types">${renderTypeBadges(pokemon.types)}</div>
        <div class="modal-pokemon-details">
          <p style="color: ${
            pokemon.textColor
          }"><strong>Abilities:</strong> ${abilities}</p>
          <p style="color: ${
            pokemon.textColor
          }"><strong>Height:</strong> ${height} m</p>
          <p style="color: ${
            pokemon.textColor
          }"><strong>Weight:</strong> ${weight} kg</p>

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
            <button class="btn btn-primary" onclick="previousPokemon()">
              ⬅️
            </button>
            <button
              class="close-button btn btn-danger"
              onclick="closePokemonModal()"
            >
              Close
            </button>
            <button class="btn btn-primary" onclick="nextPokemon()">➡️</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
