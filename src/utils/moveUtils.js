// AI-assisted - see AI-USAGE.md #<13>

export const MOVE_METHOD_ORDER = ["level-up", "machine", "egg", "tutor"];

export const MOVE_METHOD_LABELS = {
    "level-up": "Level Up",
    machine: "TM / HM",
    egg: "Egg",
    tutor: "Tutor",
};

const VERSION_GROUP_ORDER = [
    "red-blue", "yellow", "gold-silver", "crystal", "ruby-sapphire", "emerald",
    "firered-leafgreen", "diamond-pearl", "platinum", "heartgold-soulsilver",
    "black-white", "black-2-white-2", "x-y", "omega-ruby-alpha-sapphire",
    "sun-moon", "ultra-sun-ultra-moon", "lets-go-pikachu-lets-go-eevee",
    "sword-shield", "brilliant-diamond-and-shining-pearl", "legends-arceus",
    "scarlet-violet",
];

export function getVersionGroups(moves) {
    const groups = [...new Set(moves.flatMap((m) => m.details.map((d) => d.versionGroup)))];
    return groups.sort((a, b) => VERSION_GROUP_ORDER.indexOf(a) - VERSION_GROUP_ORDER.indexOf(b));
}

export function groupMovesByMethod(moves, versionGroup) {
    const groups = {};
    for (const move of moves) {
        for (const d of move.details) {
            if (d.versionGroup !== versionGroup) continue;
            (groups[d.method] ??= []).push({ ...move, level: d.level });
        }
    }
    groups["level-up"]?.sort((a, b) => a.level - b.level);
    return groups;
}