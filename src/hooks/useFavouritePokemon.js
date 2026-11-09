import { useMemo } from "react";
import { useFavourites } from "./useFavourites";
import { usePokemonData } from "./usePokemonData";

export function useFavouritePokemon() {
   const { pokemonData: pokemon, status, retry } = usePokemonData();
   const { favouriteIds, toggleFavourite } = useFavourites();

   const favourites = useMemo(
      () => pokemon.filter((item) => favouriteIds.includes(item.id)),
      [pokemon, favouriteIds],
   );

   return { favourites, toggleFavourite, status, retry };
}