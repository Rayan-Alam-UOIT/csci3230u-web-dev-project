import { useEffect, useState } from "react";
import PokemonGrid from "../components/PokemonGrid";
import MultiSelect from "../components/selectForms/MultiSelect";
import SingleSelect from "../components/selectForms/SingleSelect";

const GENERATION_INFO = {
  "generation-i":    { numeral: "I",    region: "Kanto" },
  "generation-ii":   { numeral: "II",   region: "Johto" },
  "generation-iii":  { numeral: "III",  region: "Hoenn" },
  "generation-iv":   { numeral: "IV",   region: "Sinnoh" },
  "generation-v":    { numeral: "V",    region: "Unova" },
  "generation-vi":   { numeral: "VI",   region: "Kalos" },
  "generation-vii":  { numeral: "VII",  region: "Alola" },
  "generation-viii": { numeral: "VIII", region: "Galar" },
  "generation-ix":   { numeral: "IX",   region: "Paldea" },
};

const GENERATIONS = Object.values(GENERATION_INFO).map(
  (g) => `${g.numeral} · ${g.region}`
);

const TYPES = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground",
  "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
];

const SORT_OPTIONS = [
  { value: "number-asc", label: "Number (low to high)" },
  { value: "number-desc", label: "Number (high to low)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

function BrowsePage({ searchQuery = "", onSearchChange }) {
  const [pokemon, setPokemon] = useState([]);
  const [selectedGenerations, setSelectedGenerations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sort, setSort] = useState("");

  const hasActiveFilters =
    selectedGenerations.length > 0 ||
    selectedTypes.length > 0 ||
    sort ||
    searchQuery;

  function resetFilters() {
    setSelectedGenerations([]);
    setSelectedTypes([]);
    setSort("");
    onSearchChange("");
  }

  useEffect(() => {
    document.title = "Pokéweb - Browse Pokémon";

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

  const query = searchQuery.trim().toLowerCase();

  const visiblePokemon = pokemon
    .filter((item) => {
      const info = GENERATION_INFO[item.generation?.name];
      const generationLabel = info ? `${info.numeral} · ${info.region}` : "";

      const matchesSearch =
        query === "" ||
        item.name.toLowerCase().includes(query) ||
        String(item.id) === query.replace("#", "");

      const matchesGeneration =
        selectedGenerations.length === 0 ||
        selectedGenerations.includes(generationLabel);

      const matchesType =
        selectedTypes.length === 0 ||
        item.types.some((t) =>
          selectedTypes.some((s) => s.toLowerCase() === t.type.name)
        );

      return matchesSearch && matchesGeneration && matchesType;
    })
    .sort((a, b) => {
      switch (sort) {
        case "number-asc":
          return a.id - b.id;
        case "number-desc":
          return b.id - a.id;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="page container">
      <section className="filters" aria-label="Filters">
        <h2 className="filters-title">
          FILTERS <span className="filters-tagline">· Gotta filter 'em all!</span>
        </h2>

        <div className="filters-row">
          <MultiSelect
            label="Generation"
            options={GENERATIONS}
            selected={selectedGenerations}
            onChange={setSelectedGenerations}
          />

          <MultiSelect
            label="Type"
            options={TYPES}
            selected={selectedTypes}
            onChange={setSelectedTypes}
          />

          <SingleSelect
            label="Sort"
            options={SORT_OPTIONS}
            value={sort}
            onChange={setSort}
          />

          {hasActiveFilters && (
            <button type="button" className="filters-reset" onClick={resetFilters}>
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              Clear filters
            </button>
          )}
        </div>
      </section>

      <h1 className="results-heading">
        Pokémon <span aria-hidden="true">•</span> {visiblePokemon.length} results
      </h1>

      <PokemonGrid 
        pokemon={visiblePokemon} 
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