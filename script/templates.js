//HTML für den Lade-Spinner (Bootstrap)
function loadingSpinnerHTML() {
  return `
    <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
      <div class="spinner-border text-warning" role="status" style="width: 4rem; height: 4rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
}

function getPokemonCardHTML(pokemon, index) {
  const types = pokemon.details.types
    .map((type) => `<span class="type-badge">${type.type.name}</span>`)
    .join("");

  return `
    <div class="pokedex-item" onclick="openPokemonModal(${index})">
      <img src="${pokemon.details.sprites.front_default}" alt="${pokemon.name}">
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


function getPokemonModalHTML(pokemon, index) {
  const types = pokemon.details.types.map(type => 
    `<span class="type-badge">${type.type.name}</span>`
  ).join('');
  
  return `
    <div class="pokemon-modal-overlay" onclick="closePokemonModal()">
      <div class="pokemon-modal-card" onclick="event.stopPropagation()">
        <img src="${pokemon.details.sprites.other['official-artwork'].front_default}" 
             alt="${pokemon.name}">
        <h2>#${index + 1} ${pokemon.name}</h2>
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
    </div>
  `;
}