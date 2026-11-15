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

export const TYPES = [
  "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground",
  "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy",
];

export const SORT_OPTIONS = [
  { value: "number-asc", label: "Number (low to high)" },
  { value: "number-desc", label: "Number (high to low)" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

export const CATEGORIES = ["Legendary", "Mythical"];