import { useEffect, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";

function FavouritesPage() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    document.title = "Pokéweb - Favourites";

    fetch("/data/sample.json")
      .then((response) => response.json())
      .then((data) => setPokemon(data.pokemon));
  }, []);

  function toggleFavourite(id) {
    setPokemon((currentPokemon) =>
      currentPokemon.map((item) =>
        item.id === id
          ? { ...item, is_favourite: !item.is_favourite }
          : item
      )
    );
  }

  const favouritePokemon = pokemon.filter(
    (item) => item.is_favourite
  );

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