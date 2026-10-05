import { useState } from "react";
import PokemonGrid from "../components/PokemonGrid";

const initialPokemon = [
  {
    id: 1,
    name: "Bulbasaur",
    image: "/data/sprites/official-artwork/front_default/bulbasaur.png",
    favourite: true,
  },
  {
    id: 4,
    name: "Charmander",
    image: "/data/sprites/official-artwork/front_default/charmander.png",
    favourite: true,
  },
  {
    id: 7,
    name: "Squirtle",
    image: "/data/sprites/official-artwork/front_default/squirtle.png",
    favourite: true,
  },
  {
    id: 25,
    name: "Pikachu",
    image: "/data/sprites/official-artwork/front_default/pikachu.png",
    favourite: true,
  },
  {
    id: 132,
    name: "Ditto",
    image: "/data/sprites/official-artwork/front_default/ditto.png",
    favourite: false,
  },
  {
    id: 133,
    name: "Eevee",
    image: "/data/sprites/official-artwork/front_default/eevee.png",
    favourite: true,
  },
  {
    id: 150,
    name: "Mewtwo",
    image: "/data/sprites/official-artwork/front_default/mewtwo.png",
    favourite: true,
  },
  {
    id: 152,
    name: "Chikorita",
    image: "/data/sprites/official-artwork/front_default/chikorita.png",
    favourite: false,
  },
  {
    id: 155,
    name: "Cyndaquil",
    image: "/data/sprites/official-artwork/front_default/cyndaquil.png",
    favourite: false,
  },
  {
    id: 158,
    name: "Totodile",
    image: "/data/sprites/official-artwork/front_default/totodile.png",
    favourite: false,
  },
];

function BrowsePage() {
  const [pokemon, setPokemon] = useState(initialPokemon);

  function toggleFavourite(id) {
    setPokemon((currentPokemon) =>
      currentPokemon.map((item) =>
        item.id === id
          ? { ...item, favourite: !item.favourite }
          : item
      )
    );
  }

  return (
    <div className="page container">
      <section className="filters" aria-label="Filters">
        <h2 className="filters-title">FILTERS</h2>

        <div className="filters-row">
          <label className="visually-hidden" htmlFor="generation">
            Generation
          </label>

          <div className="select-wrapper">
            <span>Generation: </span>

            <select id="generation">
              <option value="">All</option>
              <option>I</option>
              <option>II</option>
              <option>III</option>
              <option>IV</option>
              <option>V</option>
              <option>VI</option>
              <option>VII</option>
              <option>VIII</option>
              <option>IX</option>
            </select>

            <i className="fa-solid fa-chevron-down"></i>
          </div>

          <label className="visually-hidden" htmlFor="type">
            Type
          </label>

          <div className="select-wrapper">
            <span>Type: </span>

            <select id="type">
              <option value="">All</option>
              <option>Normal</option>
              <option>Fire</option>
              <option>Water</option>
              <option>Electric</option>
              <option>Grass</option>
              <option>Ice</option>
              <option>Fighting</option>
              <option>Poison</option>
              <option>Ground</option>
              <option>Flying</option>
              <option>Psychic</option>
              <option>Bug</option>
              <option>Rock</option>
              <option>Ghost</option>
              <option>Dragon</option>
              <option>Dark</option>
              <option>Steel</option>
              <option>Fairy</option>
            </select>

            <i className="fa-solid fa-chevron-down"></i>
          </div>

          <label className="visually-hidden" htmlFor="region">
            Region
          </label>

          <div className="select-wrapper">
            <span>Regions: </span>

            <select id="region">
              <option value="">All</option>
              <option>Kanto</option>
              <option>Johto</option>
              <option>Hoenn</option>
              <option>Sinnoh</option>
              <option>Unova</option>
              <option>Kalos</option>
              <option>Alola</option>
              <option>Galar</option>
              <option>Paldea</option>
            </select>

            <i className="fa-solid fa-chevron-down"></i>
          </div>

          <label className="visually-hidden" htmlFor="sort">
            Sort
          </label>

          <div className="select-wrapper">
            <span>Sort: </span>

            <select id="sort">
              <option value="">None</option>
              <option>Number (low to high)</option>
              <option>Number (high to low)</option>
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
            </select>

            <i className="fa-solid fa-chevron-down"></i>
          </div>
        </div>
      </section>

      <h1 className="results-heading">
        Pokémon <span aria-hidden="true">•</span> 1,025 results
      </h1>

      <PokemonGrid
        pokemon={pokemon}
        onToggleFavourite={toggleFavourite}
      />

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
    </div>
  );
}

export default BrowsePage;