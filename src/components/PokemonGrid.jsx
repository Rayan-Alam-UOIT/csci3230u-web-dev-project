import PokemonCard from "./PokemonCard";

function PokemonGrid({ pokemon, onToggleFavourite }) {
  return (
    <ul className="card-grid">
      {pokemon.map((item) => (
        <PokemonCard
          key={item.id}
          pokemon={item}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </ul>
  );
}

export default PokemonGrid;