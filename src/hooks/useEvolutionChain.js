
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
  const [chain, setChain] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!speciesId) {
      setChain(null);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();

    async function loadEvolutions() {
      setStatus("loading");
      setChain(null);

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
          setChain(buildTree(data.chain));
          setStatus("ok");
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    }

    loadEvolutions();

    return () => controller.abort();
  }, [speciesId]);

  return { chain, status };
}