import DataStatus from "../components/DataStatus";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import PokemonGrid from "../components/PokemonGrid";
import { usePokemon } from "../context/PokemonContext";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavourites } from "../hooks/useFavourites";
import { usePokemonBrowser } from "../hooks/usePokemonBrowser";

function BrowsePage({ searchQuery = "", onSearchChange }) {
  useDocumentTitle("Pokéweb - Browse Pokémon");

  const { pokemonData: pokemon, status, retry } = usePokemon();
  const { isFavourite, toggleFavourite } = useFavourites();

  const { filters, page, setPage, totalPages, pageItems, resultCount } = usePokemonBrowser(pokemon, searchQuery, onSearchChange);

  const pokemonWithFavourites = pageItems.map((item) => ({
    ...item,
    is_favourite: isFavourite(item.id),
  }));

  if (status !== "ok") {
    return (
      <div className="page container">
        <DataStatus status={status} onRetry={retry} />
      </div>
    );
  }

  const hasResults = resultCount > 0;

  return (
    <div className="page container">
      <FilterPanel filters={filters} />

      <h1 className="results-heading">
        Pokémon <span aria-hidden="true">•</span> {resultCount} results
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