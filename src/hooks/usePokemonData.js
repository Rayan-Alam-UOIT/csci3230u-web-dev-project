// AI-assisted - see AI-USAGE.md #<3>

import { useCallback, useEffect, useState } from "react";
import { POKEMON_DATA_URL } from "../constants/dataUrl";
import { toPokemon } from "../utils/pokemonMapper";

const BATCH_SIZE = 20;

async function fetchJson(url, signal) {
   const response = await fetch(url, { signal });
   if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
   }
   return response.json();
}

async function inBatches(items, size, task) {
   const output = [];
   for (let i = 0; i < items.length; i += size) {
      const batch = items.slice(i, i + size);
      output.push(...(await Promise.all(batch.map(task))));
   }
   return output;
}

export function usePokemonData() {
   const [pokemonData, setPokemonData] = useState([]);
   const [status, setStatus] = useState("loading");
   const [attempt, setAttempt] = useState(0);

   const retry = useCallback(() => {
      setStatus("loading");
      setAttempt((n) => n + 1);
   }, []);
   
   useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;

      async function load() {
         try {
            const { results } = await fetchJson(POKEMON_DATA_URL, signal);

            const details = await inBatches(results, BATCH_SIZE, async ({ url }) => {
               const pokemon = await fetchJson(url, signal);
               const species = await fetchJson(pokemon.species.url, signal);
               return toPokemon(pokemon, species);
            });

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
   }, [attempt]);
   
   return { pokemonData, status, retry };
}