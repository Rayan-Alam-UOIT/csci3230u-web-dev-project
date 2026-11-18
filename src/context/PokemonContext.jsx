import { createContext, useContext } from "react";

export const PokemonContext = createContext(null);

export function usePokemon() {
   const context = useContext(PokemonContext);
   if (!context) throw new Error("usePokemon must be used inside PokemonProvider");
   return context;
}