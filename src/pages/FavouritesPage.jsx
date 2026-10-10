import { useEffect, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import { useFavourites } from "../hooks/useFavourites";

function FavouritesPage() {
  const [pokemon, setPokemon] = useState([]);
  const { favouriteIds, toggleFavourite } = useFavourites();

  useEffect(() => {
    document.title = "Pokéweb - Favourites";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  const favouritePokemon = pokemon
    .filter((item) => favouriteIds.includes(item.id))
    .map((item) => ({ ...item, is_favourite: true }));

  return (
    <div className="page container">
      <h1 className="page-title">Favourites</h1>

      <h2 className="favourites-heading">
        Your saved Pokémon{" "}
        <span aria-hidden="true">•</span> {favouritePokemon.length} favourites
      </h2>

      {favouritePokemon.length > 0 ? (
        <>
          <PokemonGrid pokemon={favouritePokemon} onToggleFavourite={toggleFavourite} />

          <nav className="pagination" aria-label="Pagination">
            <a href="#" aria-label="Previous page">
              ‹
            </a>

            <a href="#" aria-current="page">
              1
            </a>

            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">5</a>

            <a href="#" aria-label="Next page">
              ›
            </a>
          </nav>
        </>
      ) : (
        <>
          <section
            className="empty-state-area"
            aria-label="Empty state area"
          >
            <p>
              No favourites yet. Save Pokémon to see them here.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

export default FavouritesPage;