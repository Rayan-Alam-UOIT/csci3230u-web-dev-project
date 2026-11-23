// AI-assisted - see AI-USAGE.md #22

import { useCallback, useMemo } from "react";
import { usePokemon } from "../context/PokemonContext";
import { usePokemonDetail } from "./usePokemonDetail";

export function usePokemonNavigation(id, navigationIds) {
   const { pokemonData: pokemonList, status: listStatus, retry: retryList } = usePokemon();

   const { pokemon, status: detailStatus, retry: retryDetail } = usePokemonDetail(id);

   const { previousPokemon, nextPokemon } = useMemo(() => {
      const byId = new Map(pokemonList.map((item) => [item.id, item]));

      const list = navigationIds
         ? navigationIds.map((navId) => byId.get(navId)).filter(Boolean)
         : pokemonList;

      const index = list.findIndex((item) => String(item.id) === id);

      if (index === -1) return { previousPokemon: null, nextPokemon: null };

      return {
         previousPokemon: list[index - 1] ?? null,
         nextPokemon: list[index + 1] ?? null,
      };
   }, [pokemonList, id, navigationIds]);

   const retry = useCallback(() => {
      retryDetail();
      if (listStatus === "error") retryList();
   }, [retryDetail, retryList, listStatus]);

   return { pokemon, previousPokemon, nextPokemon, status: detailStatus, retry };
}