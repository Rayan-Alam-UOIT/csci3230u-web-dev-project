import { useMemo } from "react";
import { usePokemon } from "../context/PokemonContext";
import { useFavourites } from "./useFavourites";

export function useFavouritePokemon() {
   const { pokemonData: pokemon, status, retry } = usePokemon();
   const { favouriteIds, toggleFavourite } = useFavourites();

   const favourites = useMemo(
      () => pokemon.filter((item) => favouriteIds.includes(item.id)),
      [pokemon, favouriteIds],
   );

   return { favourites, toggleFavourite, status, retry };
}