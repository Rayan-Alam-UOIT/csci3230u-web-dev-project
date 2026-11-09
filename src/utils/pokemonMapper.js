export function toPokemon(rawPokemon, rawSpecies) {
    const hgss = rawPokemon.sprites?.versions?.["generation-iv"]?.["heartgold-soulsilver"] ?? {};
    const artwork = rawPokemon.sprites?.other?.["official-artwork"] ?? {};

    return {
        id: rawPokemon.id,
        name: rawPokemon.name,
        generation: rawSpecies.generation.name,
        types: rawPokemon.types.map((t) => t.type.name),
        heightM: rawPokemon.height / 10,
        weightKg: rawPokemon.weight / 10,
        abilities: rawPokemon.abilities.map((a) => a.ability.name),
        eggGroups: rawSpecies.egg_groups.map((g) => g.name),
        stats: Object.fromEntries(
            rawPokemon.stats.map((s) => [s.stat.name, s.base_stat]),
        ),
        moves: rawPokemon.moves.map((m) => ({ name: m.move.name, url: m.move.url })),
        artwork: {
            default: artwork.front_default ?? null,
            shiny: artwork.front_shiny ?? null,
        },
        sprites: hgss,
        cryUrl: rawPokemon.cries?.latest ?? null,
    };
}