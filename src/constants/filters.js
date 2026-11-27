	// AI-assisted - see AI-USAGE.md #25

export const GENERATION_INFO = {
  "generation-i":    { numeral: "I",    region: "Kanto" },
  "generation-ii":   { numeral: "II",   region: "Johto" },
  "generation-iii":  { numeral: "III",  region: "Hoenn" },
  "generation-iv":   { numeral: "IV",   region: "Sinnoh" },
  "generation-v":    { numeral: "V",    region: "Unova" },
  "generation-vi":   { numeral: "VI",   region: "Kalos" },
  "generation-vii":  { numeral: "VII",  region: "Alola" },
  "generation-viii": { numeral: "VIII", region: "Galar" },
  "generation-ix":   { numeral: "IX",   region: "Paldea" },
};

export const GENERATIONS = Object.values(GENERATION_INFO).map(
  (g) => `${g.numeral} · ${g.region}`
);

export const GENERATION_REGION_KEYS = Object.fromEntries(
  Object.values(GENERATION_INFO).map((g) => [
    `${g.numeral} · ${g.region}`,
    g.region.toLowerCase(),
  ])
);

export const TYPES = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground",
  "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
];

export const SORT_OPTIONS = [
  { value: "number-asc", labelKey: "browse.sortOptions.numberAsc" },
  { value: "number-desc", labelKey: "browse.sortOptions.numberDesc" },
  { value: "name-asc", labelKey: "browse.sortOptions.nameAsc" },
  { value: "name-desc", labelKey: "browse.sortOptions.nameDesc" },
];

export const CATEGORIES = ["Legendary", "Mythical"];