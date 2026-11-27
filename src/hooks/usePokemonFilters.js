// AI-assisted - see AI-USAGE.md #26

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GENERATION_INFO } from "../constants/filters";
import { matchesSearch as matchesQuery } from "../utils/searchUtils";

export function usePokemonFilters(pokemon, searchQuery = "", onSearchChange) {
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  const [selectedGenerations, setSelectedGenerations] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("");

  const hasActiveFilters =
    selectedGenerations.length > 0 ||
    selectedTypes.length > 0 ||
    selectedCategories.length > 0 ||
    Boolean(sort) ||
    Boolean(searchQuery);

  function resetFilters() {
    setSelectedGenerations([]);
    setSelectedTypes([]);
    setSelectedCategories([]);
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
          matchesQuery(item, searchQuery, lang) ||
          String(item.id) === query.replace("#", "");

        const matchesGeneration =
          selectedGenerations.length === 0 ||
          selectedGenerations.includes(generationLabel);

        const matchesType =
          selectedTypes.length === 0 ||
          item.types.some((t) =>
            selectedTypes.some((s) => s.toLowerCase() === t)
          );

        const matchesCategory =
          selectedCategories.length === 0 ||
          (selectedCategories.includes("Legendary") && item.is_legendary) ||
          (selectedCategories.includes("Mythical") && item.is_mythical);

        return matchesSearch && matchesGeneration && matchesType && matchesCategory;
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
  }, [pokemon, searchQuery, selectedGenerations, selectedTypes, selectedCategories, sort, lang]);

  return {
    selectedGenerations, setSelectedGenerations,
    selectedTypes, setSelectedTypes,
    sort, setSort,
    hasActiveFilters,
    resetFilters,
    visiblePokemon,
    selectedCategories,
    setSelectedCategories
  };
}