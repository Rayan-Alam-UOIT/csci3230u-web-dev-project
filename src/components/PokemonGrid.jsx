import PokemonCard from "./PokemonCard";

function PokemonGrid({ pokemon, onToggleFavourite, navigationIds }) {
   return (
      <ul className="card-grid">
         {/* AI-assisted - see AI-USAGE.md #20 */}
         {pokemon.map((item, index) => (
            <PokemonCard
               key={item.id}
               pokemon={item}
               index={index}
               // AI-assisted - see AI-USAGE.md #10
               onToggleFavourite={onToggleFavourite}
               navigationIds={navigationIds}
            />
         ))}
      </ul>
   );
}

export default PokemonGrid;
