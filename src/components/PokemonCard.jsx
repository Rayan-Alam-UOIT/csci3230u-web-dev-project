import { Link, useLocation } from "react-router-dom";

function PokemonCard({ pokemon, onToggleFavourite }) {
   const location = useLocation();

   const formattedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

   return (
      <li className="card">
         <div className="card-image">
            <Link className="card-detail-link" to={`/pokemon/${pokemon.id}`} state={{ from: location.pathname }}>
               <img
                  src={pokemon.sprites.other["official-artwork"].front_default}
                  alt={formattedName}
               />
            </Link>
         </div>

         <div className="card-info">
            <Link className="card-detail-link card-link" to={`/pokemon/${pokemon.id}`} state={{ from: location.pathname }}>
               <h2 className="card-name">
                  <span className="dex-number">
                     #{String(pokemon.id).padStart(3, "0")}
                  </span>{" "}
                  {formattedName}
               </h2>
            </Link>

            <label className="fav">
               <input
                  type="checkbox"
                  aria-label={`Favourite ${formattedName}`}
                  checked={pokemon.is_favourite}
                  onChange={() => onToggleFavourite?.(pokemon.id)}
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
