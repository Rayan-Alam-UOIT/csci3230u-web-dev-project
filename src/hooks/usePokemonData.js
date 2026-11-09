// AI-assisted - see AI-USAGE.md #<3>

import { useEffect, useState } from "react";
import { POKEMON_DATA_URL } from "../constants/dataUrl";

async function fetchJson(url, signal) {
   const response = await fetch(url, { signal });
   if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
   }
   return response.json();
}

export function usePokemonData() {
   const [pokemonData, setPokemonData] = useState([]);
   const [status, setStatus] = useState("loading");
   
   useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;

      async function load() {
         try {
            const { results } = await fetchJson(POKEMON_DATA_URL, signal);

            const details = await Promise.all(
               results.map(async ({ url }) => {
                  const pokemon = await fetchJson(url, signal);
                  const species = await fetchJson(pokemon.species.url, signal);
                  return { ...pokemon, egg_groups: species.egg_groups, generation: species.generation.name };
               }),
            );

            setPokemonData(details);
            setStatus("ok");
         } catch (error) {
            if (error.name === "AbortError") return;
            console.error(error);
            setPokemonData([]);
            setStatus("error");
         }
      }

      load();
      return () => controller.abort();
   }, []);

   return { pokemonData, status };
}