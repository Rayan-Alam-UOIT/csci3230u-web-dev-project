import { useEffect } from "react";
import PokemonGrid from "../components/PokemonGrid";

const favouritePokemon = [
  {
    id: 1,
    name: "Bulbasaur",
    image:
      "/data/sprites/official-artwork/front_default/bulbasaur.png",
    favourite: true,
  },
  {
    id: 4,
    name: "Charmander",
    image:
      "/data/sprites/official-artwork/front_default/charmander.png",
    favourite: true,
  },
  {
    id: 7,
    name: "Squirtle",
    image:
      "/data/sprites/official-artwork/front_default/squirtle.png",
    favourite: true,
  },
  {
    id: 25,
    name: "Pikachu",
    image:
      "/data/sprites/official-artwork/front_default/pikachu.png",
    favourite: true,
  },
  {
    id: 133,
    name: "Eevee",
    image:
      "/data/sprites/official-artwork/front_default/eevee.png",
    favourite: true,
  },
  {
    id: 150,
    name: "Mewtwo",
    image:
      "/data/sprites/official-artwork/front_default/mewtwo.png",
    favourite: true,
  },
];

function FavouritesPage() {
  useEffect(() => {
    document.title = "Pokéweb - Favourites";
  }, []);

  return (
    <div className="page container">
      <h1 className="page-title">Favourites</h1>

      <h2 className="favourites-heading">
        Your saved Pokémon{" "}
        <span aria-hidden="true">•</span> 6 favourites
      </h2>

      <PokemonGrid pokemon={favouritePokemon} />

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

      <h2 className="empty-state-label">
        Empty state (if no favourites)
      </h2>

      <section
        className="empty-state-area"
        aria-label="Empty state area"
      >
        <p>
          No favourites yet. Save Pokémon to see them here.
        </p>
      </section>
    </div>
  );
}

export default FavouritesPage;