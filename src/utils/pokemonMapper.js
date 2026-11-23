// AI-assisted - see AI-USAGE.md #<5, 13, 22>

import { POKEAPI_BASE_URL, ARTWORK_URL, SPRITES_BASE_URL, CRY_URL } from "../constants/dataUrl";
import { SPRITE_KEYS } from "../constants/detailConstants";

function makeSpriteSet(game, fallback = {}) {
    return Object.fromEntries(SPRITE_KEYS.map((key) => [key, game?.[key] ?? fallback?.[key] ?? null]));
}

function cleanDescription(text) {
    return text
        ?.replace(/[\n\f\r]+/g, " ")
        .replace(/\s+/g, " ")
        .trim() || null;
}

function buildSpriteData(rawSprites = {}) {
    const versions = rawSprites.versions ?? {};
    const artwork = rawSprites.other?.["official-artwork"] ?? {};

    const crystal = versions["generation-ii"]?.crystal;

    const spriteSets = {
        redBlue: makeSpriteSet(versions["generation-i"]?.["red-blue"]),
        crystalAnimated: makeSpriteSet(crystal?.animated, crystal),
        blackWhiteAnimated: makeSpriteSet(versions["generation-v"]?.["black-white"]?.animated),
        showdown: makeSpriteSet(rawSprites.other?.showdown),
    };

    return {
        spriteSets,
        sprites: makeSpriteSet(spriteSets.blackWhiteAnimated, rawSprites),
        artwork: {
            default: artwork.front_default ?? null,
            shiny: artwork.front_shiny ?? null,
        },
    };
}

export function toPokemon(rawPokemon, rawSpecies) {
    const { sprites, spriteSets, artwork } = buildSpriteData(rawPokemon.sprites);

    const descriptionEntry = rawSpecies.flavor_text_entries?.find(
        (entry) => entry.language.name === "en"
    );

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
        moves: rawPokemon.moves.map(({ move, version_group_details }) => ({
            name: move.name,
            url: move.url,
            details: version_group_details.map((d) => ({
                method: d.move_learn_method.name,
                level: d.level_learned_at,
                versionGroup: d.version_group.name,
            })),
        })),
        artwork,
        sprites,
        spriteSets,
        description: cleanDescription(descriptionEntry?.flavor_text),
        cryUrl: rawPokemon.cries?.latest ?? null,
    };
}

function absolutizeSprites(value) {
    if (typeof value === "string") {
        return value.startsWith("/media/")
            ? SPRITES_BASE_URL + value.slice("/media/".length)
            : value;
    }
    if (Array.isArray(value)) return value.map(absolutizeSprites);
    if (value && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, inner]) => [key, absolutizeSprites(inner)]),
        );
    }
    return value;
}

function groupGraphqlMoves(rows) {
    const byMove = new Map();

    for (const row of rows) {
        const { id, name, type } = row.move;

        let entry = byMove.get(id);
        if (!entry) {
            entry = {
                name,
                url: `${POKEAPI_BASE_URL}/move/${id}/`,
                type: type?.name ?? null,
                details: [],
            };
            byMove.set(id, entry);
        }

        entry.details.push({
            method: row.movelearnmethod.name,
            level: row.level,
            versionGroup: row.versiongroup.name,
        });
    }

    return [...byMove.values()];
}

export function fromGraphqlDetail(row) {
    const rawSprites = row.pokemonsprites?.[0]?.sprites;
    const parsedSprites = typeof rawSprites === "string" ? JSON.parse(rawSprites) : rawSprites;
    const { sprites, spriteSets, artwork } = buildSpriteData(absolutizeSprites(parsedSprites ?? {}));

    const species = row.pokemonspecy;

    return {
        id: row.id,
        name: row.name,
        generation: species.generation.name,
        types: row.pokemontypes.map((t) => t.type.name),
        is_legendary: species.is_legendary,
        is_mythical: species.is_mythical,
        heightM: row.height / 10,
        weightKg: row.weight / 10,
        abilities: row.pokemonabilities.map((a) => a.ability.name),
        eggGroups: species.pokemonegggroups.map((g) => g.egggroup.name),
        stats: Object.fromEntries(
            row.pokemonstats.map((s) => [s.stat.name, s.base_stat]),
        ),
        moves: groupGraphqlMoves(row.pokemonmoves),
        artwork: {
            default: artwork.default ?? ARTWORK_URL(row.id),
            shiny: artwork.shiny,
        },
        sprites,
        spriteSets,
        description: cleanDescription(species.pokemonspeciesflavortexts?.[0]?.flavor_text),
        cryUrl: CRY_URL(row.id),
    };
}