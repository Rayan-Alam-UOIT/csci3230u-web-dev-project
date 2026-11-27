// AI-assisted - see AI-USAGE.md #26

export function normalize(text = "") {
   return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase()
      .trim();
}

export function matchesSearch(pokemon, query, lang) {
   const q = normalize(query);
   if (!q) return true;

   const candidates = [
      pokemon.name,            
      pokemon.names?.en,       
      pokemon.names?.[lang],  
   ].filter(Boolean);

   return candidates.some((candidate) => normalize(candidate).includes(q));
}