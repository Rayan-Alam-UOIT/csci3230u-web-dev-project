import { Link, useLocation } from "react-router-dom";

function PokemonCard({ pokemon, onToggleFavourite }) {
   const location = useLocation();

   const formattedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

   const { types, is_legendary, is_mythical } = pokemon;

   return (
      <li className="card">
         <div className="card-image">
            <Link className="card-detail-link" to={`/pokemon/${pokemon.id}`} state={{ from: location.pathname }}>
               <img
                  src={pokemon.artwork.default}
                  alt={formattedName}
               />
            </Link>
         </div>

         <div className="card-info">
            <div className="card-info-top">
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

            <div className="card-info-bottom">
               <div className="card-types">
                  {types.map((type) => (
                     <span
                        key={type}
                        className={`type type-${type}`}
                     >
                        {" "}
                        {type.toUpperCase()}{" "}
                     </span>
                  ))}
               </div>

               <div className="card-status">
                  {is_legendary && (
                     <span className="status-badge status-legendary">
                        LEGENDARY
                     </span>
                  )}

                  {is_mythical && (
                     <span className="status-badge status-mythical">
                        MYTHICAL
                     </span>
                  )}
               </div>
            </div>
         </div>
      </li>
   );
}

export default PokemonCard;
