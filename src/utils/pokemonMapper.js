export function toPokemon(rawPokemon, rawSpecies) {
    const hgss = rawPokemon.sprites?.versions?.["generation-iv"]?.["heartgold-soulsilver"] ?? {};
    const artwork = rawPokemon.sprites?.other?.["official-artwork"] ?? {};
    const defaultSprites = rawPokemon.sprites ?? {};
    const sprites = {
        front_default: hgss.front_default ?? defaultSprites.front_default ?? null,
        front_shiny: hgss.front_shiny ?? defaultSprites.front_shiny ?? null,
        back_default: hgss.back_default ?? defaultSprites.back_default ?? null,
        back_shiny: hgss.back_shiny ?? defaultSprites.back_shiny ?? null,
    };
    const descriptionEntry = rawSpecies.flavor_text_entries?.find(
        (entry) => entry.language.name === "en"
    );
    const description = descriptionEntry?.flavor_text
        ?.replace(/[\n\f\r]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || null;

    return {
        id: rawPokemon.id,
        name: rawPokemon.name,
        generation: rawSpecies.generation.name,
        types: rawPokemon.types.map((t) => t.type.name),
        is_legendary: rawSpecies.is_legendary,
        is_mythical: rawSpecies.is_mythical,
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
        sprites,
        description,
        cryUrl: rawPokemon.cries?.latest ?? null,
    };
}