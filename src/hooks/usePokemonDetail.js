// AI-assisted - see AI-USAGE.md #22

import { useCallback, useEffect, useState } from "react";
import { POKEAPI_BASE_URL, DETAIL_QUERY } from "../constants/dataUrl";
import { graphqlRequest, isGraphqlAvailable } from "../utils/graphqlClient";
import { fromGraphqlDetail, toPokemon } from "../utils/pokemonMapper";

const detailCache = new Map();

async function fetchDetailViaGraphql(id, signal) {
   const data = await graphqlRequest(DETAIL_QUERY, { id: Number(id) }, signal);

   const row = data?.pokemon?.[0];
   if (!row) throw new Error(`GraphQL returned no Pokémon for ${id}`);

   return fromGraphqlDetail(row);
}

async function fetchDetailViaRest(id, signal) {
   const [pokemonResponse, speciesResponse] = await Promise.all([
      fetch(`${POKEAPI_BASE_URL}/pokemon/${id}`, { signal }),
      fetch(`${POKEAPI_BASE_URL}/pokemon-species/${id}`, { signal }),
   ]);

   if (pokemonResponse.status === 404 || speciesResponse.status === 404) {
      const error = new Error(`No Pokémon with id ${id}`);
      error.notFound = true;
      throw error;
   }
   if (!pokemonResponse.ok || !speciesResponse.ok) {
      throw new Error(`Failed to load details for ${id}`);
   }

   const [pokemon, species] = await Promise.all([
      pokemonResponse.json(),
      speciesResponse.json(),
   ]);

   return toPokemon(pokemon, species);
}

async function fetchDetail(id, signal) {
   if (/^\d+$/.test(id) && isGraphqlAvailable()) {
      try {
         return await fetchDetailViaGraphql(id, signal);
      } catch (graphqlError) {
         if (signal.aborted) throw graphqlError;
         console.warn(`GraphQL detail failed for ${id}, falling back to REST`, graphqlError);
      }
   }

   return fetchDetailViaRest(id, signal);
}

export function usePokemonDetail(id) {
   const [result, setResult] = useState({ id: null, status: "loading", pokemon: null });
   const [attempt, setAttempt] = useState(0);

   const retry = useCallback(() => {
      setResult({ id: null, status: "loading", pokemon: null });
      setAttempt((n) => n + 1);
   }, []);

   useEffect(() => {
      if (!id || detailCache.has(id)) return;

      const controller = new AbortController();

      fetchDetail(id, controller.signal)
         .then((pokemon) => {
            detailCache.set(id, pokemon);
            setResult({ id, status: "ok", pokemon });
         })
         .catch((error) => {
            if (controller.signal.aborted) return;
            console.error(error);
            setResult({
               id,
               status: error.notFound ? "notFound" : "error",
               pokemon: null,
            });
         });

      return () => controller.abort();
   }, [id, attempt]);

   const cached = detailCache.get(id);
   if (cached) return { pokemon: cached, status: "ok", retry };
   if (result.id === id) {
      return { pokemon: result.pokemon, status: result.status, retry };
   }
   return { pokemon: null, status: "loading", retry };
}