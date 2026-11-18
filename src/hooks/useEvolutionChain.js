// AI-assisted - see AI-USAGE.md #<9, 15>

import { useEffect, useState } from "react";

function buildTree(node) {
  return {
    name: node.species.name,
    id: Number(node.species.url.match(/\/(\d+)\/?$/)?.[1]),
    evolutionDetails: node.evolution_details,
    evolvesTo: node.evolves_to.map(buildTree),
  };
}

export function useEvolutionChain(speciesId) {

  const [result, setResult] = useState({
    speciesId: null,
    chain: null,
    errors: false,
  });

  useEffect(() => {
    if (!speciesId) return;

    const controller = new AbortController();

    async function loadEvolutions() {

      try {
        const speciesResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${speciesId}/`,
          { signal: controller.signal }
        );

        if (!speciesResponse.ok) throw new Error("Species request failed");

        const species = await speciesResponse.json();

        const chainResponse = await fetch(
          species.evolution_chain.url,
          { signal: controller.signal }
        );

        if (!chainResponse.ok) throw new Error("Evolution request failed");

        const data = await chainResponse.json();

        if (!controller.signal.aborted) {
          setResult({
            speciesId,
            chain: buildTree(data.chain),
            error: false,
          });
        }
      } catch {
        if (!controller.signal.aborted) {
          setResult({
            speciesId,
            chain: null,
            error: true,
          });
        }
      }
    }

    loadEvolutions();

    return () => controller.abort();
  }, [speciesId]);

  if (!speciesId) {
    return { chain: null, status: "idle" };
  }

  if (result.speciesId !== speciesId) {
    return { chain: null, status: "loading" };
  }

  if (result.error) {
    return { chain: null, status: "error" };
  }

  return { chain: result.chain, status: "ok" };
}