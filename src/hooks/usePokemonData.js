// AI-assisted - see AI-USAGE.md #<3, 22>

import { useCallback, useEffect, useState } from "react";
import { POKEAPI_BASE_URL, POKEMON_LIMIT, ARTWORK_URL, REST_BATCH_SIZE, LIST_QUERY } from "../constants/dataUrl";
import { graphqlRequest } from "../utils/graphqlClient";
import { toPokemon, buildLocalizedNames } from "../utils/pokemonMapper";

function fromGraphql(row) {
   return {
      id: row.id,
      name: row.name,
      names: buildLocalizedNames(row.pokemonspecy.pokemonspeciesnames),
      generation: row.pokemonspecy.generation.name,
      types: row.pokemontypes.map((t) => t.type.name),
      is_legendary: row.pokemonspecy.is_legendary,
      is_mythical: row.pokemonspecy.is_mythical,
      heightM: row.height / 10,
      weightKg: row.weight / 10,
      artwork: { default: ARTWORK_URL(row.id) },
   };
}

function toListItem(full) {
   return {
      id: full.id,
      name: full.name,
      names: full.names,
      generation: full.generation,
      types: full.types,
      is_legendary: full.is_legendary,
      is_mythical: full.is_mythical,
      heightM: full.heightM,
      weightKg: full.weightKg,
      artwork: { default: full.artwork.default },
   };
}

async function fetchJson(url, signal) {
   const response = await fetch(url, { signal });
   if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
   }
   return response.json();
}

async function loadViaGraphql(signal) {
   const data = await graphqlRequest(LIST_QUERY, { limit: POKEMON_LIMIT }, signal);
   const rows = data?.pokemon;
   if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("GraphQL returned no Pokémon");
   }
   return rows.map(fromGraphql);
}

async function loadViaRest(signal, onBatch) {
   const { results } = await fetchJson(
      `${POKEAPI_BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`,
      signal,
   );

   for (let i = 0; i < results.length; i += REST_BATCH_SIZE) {
      const batch = results.slice(i, i + REST_BATCH_SIZE);

      const items = await Promise.all(
         batch.map(async ({ url }) => {
            const pokemon = await fetchJson(url, signal);
            const species = await fetchJson(pokemon.species.url, signal);
            return toListItem(toPokemon(pokemon, species));
         }),
      );

      if (signal.aborted) return;
      onBatch(items);
   }
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
            const list = await loadViaGraphql(signal);
            if (signal.aborted) return;

            setPokemonData(list);
            setStatus("ok");
            setIsLoadingMore(false);
            return;
         } catch (graphqlError) {
            if (signal.aborted) return;
            console.warn("GraphQL load failed, falling back to REST", graphqlError);
         }

         try {
            await loadViaRest(signal, (items) => {
               setPokemonData((prev) => [...prev, ...items]);
               setStatus("ok");
            });
            if (!signal.aborted) setIsLoadingMore(false);
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