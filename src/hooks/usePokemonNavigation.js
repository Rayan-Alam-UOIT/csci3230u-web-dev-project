import { useMemo } from "react";
import { usePokemon } from "../context/PokemonContext";

export function usePokemonNavigation(id, navigationIds) {
   const { pokemonData: pokemonList, status, retry } = usePokemon();

   const navigation = useMemo(() => {
      const pokemon = pokemonList.find((item) => String(item.id) === id);

      const list = navigationIds
         ? navigationIds
              .map((navId) => pokemonList.find((item) => item.id === navId))
              .filter(Boolean)
         : pokemonList;

      const index = list.findIndex((item) => String(item.id) === id);

      return {
         pokemon: pokemon ?? null,
         previousPokemon: list[index - 1] ?? null,
         nextPokemon: list[index + 1] ?? null,
      };
   }, [pokemonList, id, navigationIds]);

   return { ...navigation, status, retry };
}
