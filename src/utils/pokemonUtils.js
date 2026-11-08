// AI-assisted - see AI-USAGE.md #<3>

export function normalize(text) {
   return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
}

export function capitalize(name) {
   return name.charAt(0).toUpperCase() + name.slice(1);
}

export function titleCase(text) {
   return text.split(/[ -]+/).map(capitalize).join(" ");
}

export function chooseRandomPokemon(rounds, count) {
   const available = [...rounds];
   const chosen = [];

   while (chosen.length < count && available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      chosen.push(available.splice(randomIndex, 1)[0]);
   }

   return chosen;
}

export function shuffle(list) {
   return chooseRandomPokemon(list, list.length);
}