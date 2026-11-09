import { useMemo } from "react";
import { usePokemon } from "../context/PokemonContext";

export function usePokemonNavigation(id) {
    const { pokemonData: pokemonList, status, retry } = usePokemon();
    
    const navigation = useMemo(() => {
        const index = pokemonList.findIndex((item) => String(item.id) === id);

        if (index === -1) {
            return { pokemon: null, previousPokemon: null, nextPokemon: null };
        }

        return {
            pokemon: pokemonList[index],
            previousPokemon: pokemonList[index - 1] ?? null,
            nextPokemon: pokemonList[index + 1] ?? null,
        };
    }, [pokemonList, id]);

    return { ...navigation, status, retry };
}