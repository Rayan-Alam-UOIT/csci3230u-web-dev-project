
import { useEffect, useState } from "react";

function flattenChain(node, depth = 0) {
  return [
    {
      name: node.species.name,
      id: Number(node.species.url.match(/\/(\d+)\/?$/)?.[1]),
      depth,
      evolutionDetails: node.evolution_details,
    },
    ...node.evolves_to.flatMap((next) =>
      flattenChain(next, depth + 1)
    ),
  ];
}

export function useEvolutionChain(speciesId) {
  const [evolutions, setEvolutions] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!speciesId) {
      setEvolutions([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();

    async function loadEvolutions() {
      setStatus("loading");
      setEvolutions([]);

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
          setEvolutions(flattenChain(data.chain));
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

  return { evolutions, status };
}