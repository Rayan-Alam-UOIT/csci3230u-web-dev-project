import PokemonCard from "./PokemonCard";

function PokemonGrid({ pokemon, onToggleFavourite, navigationIds }) {
   return (
      <ul className="card-grid">
         {pokemon.map((item) => (
            <PokemonCard
               key={item.id}
               pokemon={item}
               // AI-assisted - see AI-USAGE.md #10
               onToggleFavourite={onToggleFavourite}
               navigationIds={navigationIds}
            />
         ))}
      </ul>
   );
}

export default PokemonGrid;
