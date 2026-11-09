import { createContext, useContext, useMemo } from "react";
import { usePokemonData } from "../hooks/usePokemonData";

const PokemonContext = createContext(null);

export function PokemonProvider({ children }) {
   const { pokemonData, status, retry } = usePokemonData();

   const value = useMemo(
      () => ({ pokemonData, status, retry }),
      [pokemonData, status, retry],
   );

   return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>;
}

export function usePokemon() {
   const context = useContext(PokemonContext);
   if (!context) throw new Error("usePokemon must be used inside PokemonProvider");
   return context;
}