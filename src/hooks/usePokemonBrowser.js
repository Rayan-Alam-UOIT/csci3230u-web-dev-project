import { useEffect, useRef } from "react";
import { PAGE_SIZE } from "../constants/browseConstants";
import { usePagination } from "./usePagination";
import { usePokemonFilters } from "./usePokemonFilters";

export function usePokemonBrowser(
   pokemon,
   searchQuery,
   onSearchChange,
   pagination = {},
) {
   const filters = usePokemonFilters(pokemon, searchQuery, onSearchChange);
   const resultCount = filters.visiblePokemon.length;

   const { page, setPage, totalPages, pageItems } = usePagination(
      filters.visiblePokemon,
      PAGE_SIZE,
      pagination.page,
      pagination.onPageChange,
   );

   const filterKey = JSON.stringify([
      searchQuery,
      filters.selectedGenerations,
      filters.selectedTypes,
      filters.sort,
   ]);
   const previousFilterKey = useRef(filterKey);

   useEffect(() => {
      if (previousFilterKey.current !== filterKey) {
         previousFilterKey.current = filterKey;
         setPage(1);
      }
   }, [filterKey, setPage]);

   return { filters, page, setPage, totalPages, pageItems, resultCount };
}
