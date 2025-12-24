let isFiltering = false;

/**
 * Search Pokemon based on input from search bar
 */
function searchPokemon() {
  const searchInput = document.getElementById("search-bar").value.toLowerCase();
  toggleClearButton(searchInput);
  if (!validateSearchInput(searchInput)) return;
  performSearch(searchInput);
  toggleVisibilityMorePokemonButton();
}

/**
 * Validate search input length
 * @param {string} searchInput - The search query entered by the user
 * @returns {boolean} True if input is valid, false otherwise
 */
function validateSearchInput(searchInput) {
  const message = document.getElementById("search-message");
  if (searchInput.length > 0 && searchInput.length < 3) {
    message.textContent = " 3 characters required";
    message.classList.remove("d-none");
    isFiltering = false;
    filteredPokedexData = [];
    return false;
  }
  message.classList.add("d-none");
  return true;
}

/**
 * Perform the actual search operation
 * @param {string} searchInput - The validated search query
 */
function performSearch(searchInput) {
  if (searchInput.length >= 3) {
    isFiltering = true;
    renderFilteredPokemon(searchInput);
  } else {
    isFiltering = false;
    filteredPokedexData = [];
    renderPokedexListView();
  }
}

/**
 * Clear the search input and reset the view
 */
function clearSearch() {
  document.getElementById("search-bar").value = "";
  document.getElementById("clear-search-btn").classList.add("d-none");
  renderPokedexListView();
  isFiltering = false;
  filteredPokedexData = [];
  toggleVisibilityMorePokemonButton();
}

/**
 * Toggle visibility of the clear button based on input
 * @param {string} searchInput - The current search input value
 */
function toggleClearButton(searchInput) {
  const clearBtn = document.getElementById("clear-search-btn");
  clearBtn.classList.toggle("d-none", searchInput.length === 0);
}