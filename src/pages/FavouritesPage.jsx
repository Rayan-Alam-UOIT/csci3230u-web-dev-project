import { useEffect, useMemo, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import FilterPanel from "../components/FilterPanel";
import { usePokemonFilters } from "../hooks/usePokemonFilters";
import { useFavourites } from "../hooks/useFavourites";

function FavouritesPage({ searchQuery = "", onSearchChange }) {
  const [pokemon, setPokemon] = useState([]);
  const { favouriteIds, toggleFavourite } = useFavourites();

  useEffect(() => {
    document.title = "Pokéweb - Favourites";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  const favourites = useMemo(
    () => pokemon.filter((item) => favouriteIds.includes(item.id)),
    [pokemon, favouriteIds]
  );

  const filters = usePokemonFilters(favourites, searchQuery, onSearchChange);

  const favouritePokemon = filters.visiblePokemon.map((item) => ({
    ...item,
    is_favourite: true,
  }));

  const hasFavourites = favourites.length > 0;
  const hasResults = favouritePokemon.length > 0;

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

export default FavouritesPage;