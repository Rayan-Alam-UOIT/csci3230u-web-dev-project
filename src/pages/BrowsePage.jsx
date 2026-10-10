import { useEffect, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { usePokemonFilters } from "../hooks/usePokemonFilters";
import { useFavourites } from "../hooks/useFavourites";
import { usePagination } from "../hooks/usePagination";

const PAGE_SIZE = 9;

function BrowsePage({ searchQuery = "", onSearchChange }) {
  const [pokemon, setPokemon] = useState([]);
  const { isFavourite, toggleFavourite } = useFavourites();
  const filters = usePokemonFilters(pokemon, searchQuery, onSearchChange);
  const { page, setPage, totalPages, pageItems } = usePagination(
    filters.visiblePokemon,
    PAGE_SIZE
  );

  useEffect(() => {
    document.title = "Pokéweb - Browse Pokémon";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.visiblePokemon.length, setPage]);

  const pokemonWithFavourites = pageItems.map((item) => ({
    ...item,
    is_favourite: isFavourite(item.id),
  }));

  const hasResults = filters.visiblePokemon.length > 0;

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

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default BrowsePage;