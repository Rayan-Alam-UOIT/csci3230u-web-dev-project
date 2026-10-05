function PokemonCard({ pokemon, onToggleFavourite }) {
  return (
    <li className="card">
      <div className="card-image">
        <img src={pokemon.image} alt={pokemon.name} />
      </div>

      <div className="card-info">
        <h2 className="card-name">
          <span className="dex-number">
            #{String(pokemon.id).padStart(3, "0")}
          </span>{" "}
          {pokemon.name}
        </h2>

        <label className="fav">
          <input
            type="checkbox"
            aria-label={`Favourite ${pokemon.name}`}
            checked={pokemon.favourite}
            onChange={() =>
              onToggleFavourite?.(pokemon.id)
            }
          />

          <i
            className="fa-regular fa-heart fav-heart-outline"
            aria-hidden="true"
          ></i>

          <i
            className="fa-solid fa-heart fav-heart-solid"
            aria-hidden="true"
          ></i>
        </label>
      </div>
    </li>
  );
}

export default PokemonCard;