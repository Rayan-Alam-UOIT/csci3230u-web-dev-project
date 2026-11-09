import { useState, useMemo } from "react";
import { GENERATION_INFO } from "../constants/filters";

export function usePokemonFilters(pokemon, searchQuery = "", onSearchChange) {
  const [selectedGenerations, setSelectedGenerations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sort, setSort] = useState("");

  const hasActiveFilters =
    selectedGenerations.length > 0 ||
    selectedTypes.length > 0 ||
    Boolean(sort) ||
    Boolean(searchQuery);

  function resetFilters() {
    setSelectedGenerations([]);
    setSelectedTypes([]);
    setSort("");
    onSearchChange?.("");
  }

  const visiblePokemon = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return pokemon
      .filter((item) => {
        const info = GENERATION_INFO[item.generation];
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
          case "number-asc":  return a.id - b.id;
          case "number-desc": return b.id - a.id;
          case "name-asc":    return a.name.localeCompare(b.name);
          case "name-desc":   return b.name.localeCompare(a.name);
          default:            return 0;
        }
      });
  }, [pokemon, searchQuery, selectedGenerations, selectedTypes, sort]);

  return {
    selectedGenerations, setSelectedGenerations,
    selectedTypes, setSelectedTypes,
    sort, setSort,
    hasActiveFilters,
    resetFilters,
    visiblePokemon,
  };
}