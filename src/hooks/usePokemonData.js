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

export function usePokemonData() {
   const [pokemonData, setPokemonData] = useState([]);
   const [status, setStatus] = useState("loading");
   const [isLoadingMore, setIsLoadingMore] = useState(true);
   const [attempt, setAttempt] = useState(0);

   const retry = useCallback(() => {
      setStatus("loading");
      setAttempt((n) => n + 1);
   }, []);

   useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;

      async function load() {
         setPokemonData([]);
         setStatus("loading");
         setIsLoadingMore(true);

         try {
            const { results } = await fetchJson(
               POKEMON_DATA_URL,
               signal
            );

            for (let i = 0; i < results.length; i += BATCH_SIZE) {
               const batch = results.slice(i, i + BATCH_SIZE);

               const details = await Promise.all(
                  batch.map(async ({ url }) => {
                     const pokemon = await fetchJson(url, signal);
                     const species = await fetchJson(
                        pokemon.species.url,
                        signal
                     );
                     return toPokemon(pokemon, species);
                  })
               );

               if (signal.aborted) return;

               setPokemonData((prev) => [...prev, ...details]);

               if (i === 0) {
                  setStatus("ok");
               }
            }

            if (!signal.aborted) {
               setStatus("ok");
               setIsLoadingMore(false);
            }
         } catch (error) {
            if (signal.aborted) return;
            console.error(error);
            setPokemonData([]);
            setStatus("error");
            setIsLoadingMore(false);
         }
      }

      load();
      return () => controller.abort();
   }, [attempt]);

   return { pokemonData, status, retry, isLoadingMore };
}