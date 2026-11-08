import { useEffect } from "react";
import { PAGE_SIZE } from "../constants/browseConstants";
import { usePagination } from "./usePagination";
import { usePokemonFilters } from "./usePokemonFilters";

export function usePokemonBrowser(pokemon, searchQuery, onSearchChange) {
    const filters = usePokemonFilters(pokemon, searchQuery, onSearchChange);
    const resultCount = filters.visiblePokemon.length;
    
    const { page, setPage, totalPages, pageItems } = usePagination(
        filters.visiblePokemon,
        PAGE_SIZE,
    );
    
    useEffect(() => {
        setPage(1);
    }, [resultCount, setPage]);
    
    return { filters, page, setPage, totalPages, pageItems, resultCount };
}