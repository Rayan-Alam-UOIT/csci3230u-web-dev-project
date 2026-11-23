// AI-assisted - see AI-USAGE.md #<10, 21>

import { Link, useLocation } from "react-router-dom";

function PokemonCard({ pokemon, onToggleFavourite, navigationIds, index=0 }) {
   const location = useLocation();

   const formattedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

   const { types, is_legendary, is_mythical } = pokemon;

   return (
      <li className="card">
         <div className="card-image">
            <Link
               className="card-detail-link"
               to={`/pokemon/${pokemon.id}`}
               state={{ from: location.pathname, navigationIds }}
            >
               {/* AI-assisted - see AI-USAGE.md #20 */}
               <img
                  src={pokemon.artwork.default}
                  alt={formattedName}
                  width={475}
                  height={475}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  decoding="async"
               />
            </Link>
         </div>

         <div className="card-info">
            <div className="card-info-top">
               <Link
                  className="card-detail-link card-link"
                  to={`/pokemon/${pokemon.id}`}
                  state={{ from: location.pathname, navigationIds }}
               >
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

                  <svg
                     className="fav-heart-outline"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                  >
                     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                  </svg>

                  <svg
                     className="fav-heart-solid"
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                     fill="currentColor"
                  >
                     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
                  </svg>
               </label>
            </div>

            <div className="card-info-bottom">
               <div className="card-types">
                  {types.map((type) => (
                     <span key={type} className={`type type-${type}`}>
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
