import { useEffect, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import FilterPanel from "../components/FilterPanel";
import { usePokemonFilters } from "../hooks/usePokemonFilters";
import { useFavourites } from "../hooks/useFavourites";

function BrowsePage({ searchQuery = "", onSearchChange }) {
  const [pokemon, setPokemon] = useState([]);
  const { isFavourite, toggleFavourite } = useFavourites();
  const filters = usePokemonFilters(pokemon, searchQuery, onSearchChange);

  useEffect(() => {
    document.title = "Pokéweb - Browse Pokémon";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  const pokemonWithFavourites = filters.visiblePokemon.map((item) => ({
    ...item,
    is_favourite: isFavourite(item.id),
  }));

  const hasResults = pokemonWithFavourites.length > 0;

  return (
    <div className="page container">
      <FilterPanel filters={filters} />

      <h1 className="results-heading">
        Pokémon <span aria-hidden="true">•</span> {filters.visiblePokemon.length} results
      </h1>

      {!hasResults ? (
        <section className="empty-state-area" aria-label="No matching favourites">
          <p>No Pokémon match your filters.</p>
        </section>
      ) : (
        <>
          <PokemonGrid
            pokemon={pokemonWithFavourites}
            onToggleFavourite={toggleFavourite}
          />

          <nav className="pagination" aria-label="Pagination">
            <a href="#" aria-label="Previous page">‹</a>
            <a href="#" aria-current="page">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>
            <a href="#" aria-label="Next page">›</a>
          </nav>
        </>
      )}
    </div>
  );
}

export default BrowsePage;