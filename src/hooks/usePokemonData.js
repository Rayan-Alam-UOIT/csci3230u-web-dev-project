// AI-assisted - see AI-USAGE.md #<3>

import { useEffect, useState } from "react";
import { POKEMON_DATA_URL } from "../constants/dataUrl";

export function usePokemonData() {
   const [pokemonData, setPokemonData] = useState([]);

   useEffect(() => {
      fetch(POKEMON_DATA_URL)
         .then((response) => {
            if (!response.ok) {
               throw new Error(
                  `Failed to load Pokémon data: ${response.status}`,
               );
            }
            return response.json();
         })
         .then((data) => setPokemonData(data.pokemon))
         .catch((error) => {
            console.error(error);
            setPokemonData([]);
         });
   }, []);

   return pokemonData;
}