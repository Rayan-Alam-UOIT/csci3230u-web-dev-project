import { SPRITE_KEYS } from "../constants/detailConstants";

function makeSpriteSet(game, fallback = {}) {
    return Object.fromEntries(SPRITE_KEYS.map((key) => [key, game?.[key] ?? fallback?.[key] ?? null]));
}

export function toPokemon(rawPokemon, rawSpecies) {
    const rawSprites = rawPokemon.sprites ?? {};
    const versions = rawSprites.versions ?? {};
    const artwork = rawSprites.other?.["official-artwork"] ?? {};

    const crystal = versions["generation-ii"]?.crystal;

    const spriteSets = {
        redBlue: makeSpriteSet(versions["generation-i"]?.["red-blue"]),
        crystalAnimated: makeSpriteSet(crystal?.animated, crystal),
        blackWhiteAnimated: makeSpriteSet(versions["generation-v"]?.["black-white"]?.animated),
        showdown: makeSpriteSet(rawSprites.other?.showdown),
    };

    const sprites = makeSpriteSet(spriteSets.blackWhiteAnimated, rawSprites);

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
        spriteSets,
        description,
        cryUrl: rawPokemon.cries?.latest ?? null,
    };
}