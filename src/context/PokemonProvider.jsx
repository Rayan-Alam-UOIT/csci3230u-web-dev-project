import { useMemo } from "react";
import { PokemonContext } from "./PokemonContext";

import { usePokemonData } from "../hooks/usePokemonData";

export function PokemonProvider({ children }) {
   const { pokemonData, status, retry, isLoadingMore } = usePokemonData();

   const value = useMemo(
      () => ({ pokemonData, status, retry, isLoadingMore }),
      [pokemonData, status, retry, isLoadingMore],
   );

   return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}