import { useMemo } from "react";
import { PokemonContext } from "./PokemonContext";

import { usePokemonData } from "../hooks/usePokemonData";

export function PokemonProvider({ children }) {
   const { pokemonData, status, retry } = usePokemonData();

   const value = useMemo(
      () => ({ pokemonData, status, retry }),
      [pokemonData, status, retry],
   );

   return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}