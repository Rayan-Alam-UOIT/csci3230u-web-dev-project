import { useEffect, useMemo, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { usePokemonFilters } from "../hooks/usePokemonFilters";
import { useFavourites } from "../hooks/useFavourites";
import { usePagination } from "../hooks/usePagination";

const PAGE_SIZE = 9;

function FavouritesPage({ searchQuery = "", onSearchChange }) {
  const [pokemon, setPokemon] = useState([]);
  const { favouriteIds, toggleFavourite } = useFavourites();
  const favourites = useMemo(
    () => pokemon.filter((item) => favouriteIds.includes(item.id)),
    [pokemon, favouriteIds]
  );

  const filters = usePokemonFilters(favourites, searchQuery, onSearchChange);

  const { page, setPage, totalPages, pageItems } = usePagination(
    filters.visiblePokemon,
    PAGE_SIZE
  );

  useEffect(() => {
    document.title = "Pokéweb - Favourites";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.visiblePokemon.length, setPage]);

  const favouritePokemon = pageItems.map((item) => ({
    ...item,
    is_favourite: true,
  }));

  const hasFavourites = favourites.length > 0;
  const hasResults = filters.visiblePokemon.length > 0;

  return (
    <div className="page container">
      <h1 className="page-title">Favourites</h1>

      {hasFavourites && <FilterPanel filters={filters} />}

      <h2 className="favourites-heading">
        Your saved Pokémon <span aria-hidden="true">•</span>{" "}
        {favouritePokemon.length === favourites.length
          ? `${favourites.length} favourites`
          : `${favouritePokemon.length} of ${favourites.length} favourites`}
      </h2>

      {!hasFavourites ? (
        <section className="empty-state-area" aria-label="Empty state area">
          <p>No favourites yet. Save Pokémon to see them here.</p>
        </section>
      ) : !hasResults ? (
        <section className="empty-state-area" aria-label="No matching favourites">
          <p>No Pokémon match your filters.</p>
        </section>
      ) : (
        <>
          <PokemonGrid
            pokemon={favouritePokemon}
            onToggleFavourite={toggleFavourite}
          />

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default FavouritesPage;