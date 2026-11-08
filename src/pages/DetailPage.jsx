// AI-assisted - see AI-USAGE.md #<4>

import { Fragment } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { BASE_STAT_ROWS, SPRITE_ITEMS } from "../constants/detailConstants";
import { useCry } from "../hooks/useCry";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavourites } from "../hooks/useFavourites";
import { usePokemonNavigation } from "../hooks/usePokemonNavigation";
import { capitalize, titleCase } from "../utils/pokemonUtils";

function DetailPage() {
   useDocumentTitle("Pokéweb - Details");
   
   const { id } = useParams();
   const { pokemon, previousPokemon, nextPokemon } = usePokemonNavigation(id);
   const { isFavourite, toggleFavourite } = useFavourites();
   const { play: playCry, isPlaying, fillRef } = useCry(pokemon?.cries.latest);

   const location = useLocation();
   const origin = location.state?.from ?? "/";
   const originLabel = origin === "/favourites" ? "Favourites" : "Pokémon";

   if (!pokemon) {
      return null;
   }

   const formattedName = capitalize(pokemon.name);

   const types = pokemon.types.map((item) => item.type.name);

   const abilities = pokemon.abilities
      .map((item) => titleCase(item.ability.name))
      .join(", ");

   const eggGroups = pokemon.egg_groups
      .map((item) => titleCase(item.name))
      .join(" / ");

   const stats = pokemon.stats;
   const moves = pokemon.moves;

   const sprites =
      pokemon.sprites.versions["generation-iv"]["heartgold-soulsilver"];

   const officialArtwork =
      pokemon.sprites.other["official-artwork"].front_default;

   const shinyArtwork = pokemon.sprites.other["official-artwork"].front_shiny;

   return (
      <div className="page container">
         <nav>
            <Link to={origin} className="back-button">
               ‹ &nbsp; Back to {originLabel}
            </Link>
         </nav>

         <ul className="card-list">
            <li className="head">
               <div className="head-image">
                  <img
                     id="pokemon-img"
                     src={`/${officialArtwork}`}
                     alt={formattedName}
                     className="pokecard-image"
                  />
               </div>

               <div className="head-info">
                  <h1 className="head-name">
                     <span className="dex-number">
                        #{String(pokemon.id).padStart(3, "0")}
                     </span>{" "}
                     {formattedName}
                  </h1>

                  <div className="card-row">
                     {types.map((type) => (
                        <span
                           key={type}
                           className={`card-value type type-${type}`}
                        >
                           {" "}
                           {type.toUpperCase()}{" "}
                        </span>
                     ))}

                     <label className="fav">
                        <input
                           type="checkbox"
                           aria-label={`Favourite ${formattedName}`}
                           checked={isFavourite(pokemon.id)}
                           onChange={() => toggleFavourite(pokemon.id)}
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

                     <span>Favourite</span>
                  </div>

                  <div className="head-stats">
                     <span className="card-label">Height:</span>
                     <span className="card-value">
                        {(pokemon.height / 10).toFixed(1)}m
                     </span>

                     <span className="card-label">Weight:</span>
                     <span className="card-value">
                        {(pokemon.weight / 10).toFixed(1)} kg
                     </span>

                     <span className="card-label">Abilities:</span>
                     <span className="card-value">{abilities}</span>

                     <span className="card-label">Egg Group:</span>
                     <span className="card-value">{eggGroups}</span>
                  </div>
                  <div className="sprites-row">
                     <ul className="sprites-list">
                        <li>
                           <button
                              type="button"
                              className="sprite-link-off"
                              popoverTarget="artwork-shiny"
                           >
                              <img
                                 src={`/${shinyArtwork}`}
                                 alt={`${formattedName} shiny official artwork`}
                                 className="sprite-img-off"
                              />
                           </button>

                           <img
                              popover="auto"
                              id="artwork-shiny"
                              className="sprite-popover"
                              src={`/${shinyArtwork}`}
                              alt={`${formattedName} shiny official artwork, enlarged`}
                           />
                        </li>
                     </ul>
                  </div>
               </div>
            </li>

            <li className="body-row">
               <ul className="body-list">
                  <li className="body">
                     <div className="card-row">
                        <span className="detail-type">BASE STATS</span>
                     </div>

                     <div className="body-stats base-stats">
                        {BASE_STAT_ROWS.map(({ label, stat }) => (
                           <Fragment key={stat}>
                              <span className="card-label">{label}</span>
                              <span className="card-value">
                                 {" "}
                                 {
                                    stats.find((item) => item.stat.name === stat)
                                       .base_stat
                                 }{" "}
                              </span>
                           </Fragment>
                        ))}
                     </div>
                  </li>

                  <li className="body">
                     <div className="card-row">
                        <span className="detail-type">MOVES</span>
                     </div>

                     <div className="body-stats">
                        {moves.map((item) => (
                           <Fragment key={item.move.name}>
                              <span className="card-label">
                                 {titleCase(item.move.name)}:
                              </span>

                              <span
                                 className={`card-value type type-${item.move.type}`}
                              >
                                 {titleCase(item.move.type)}
                              </span>
                           </Fragment>
                        ))}
                     </div>
                  </li>
               </ul>
            </li>
         </ul>

         <nav className="details-nav">
            {previousPokemon && (
               <Link
                  to={`/pokemon/${previousPokemon.id}`}
                  className="nav-prev"
                  state={location.state}
               >
                  &larr; Previous Pokemon
               </Link>
            )}

            {nextPokemon && (
               <Link
                  to={`/pokemon/${nextPokemon.id}`}
                  className="nav-next"
                  state={location.state}
               >
                  Next Pokemon &rarr;
               </Link>
            )}
         </nav>

         <section className="sprites-section" aria-labelledby="sprites-heading">
            <h2 id="sprites-heading" className="sprites-heading">
               Sprites &amp; Cry
            </h2>

            <div className="sprites-row">
               <ul className="sprites-list">
                  {SPRITE_ITEMS.map(({ key, id: popoverId, label }) => (
                     <li key={popoverId}>
                        <button
                           type="button"
                           className="sprite-link"
                           popoverTarget={popoverId}
                        >
                           <img
                              src={`/${sprites[key]}`}
                              alt={`${formattedName} ${label}`}
                              className="sprite-img"
                           />
                        </button>

                        <img
                           popover="auto"
                           id={popoverId}
                           className="sprite-popover"
                           src={`/${sprites[key]}`}
                           alt={`${formattedName} ${label}, enlarged`}
                        />
                     </li>
                  ))}
               </ul>

               <button
                  type="button"
                  className={`play-sound ${isPlaying ? "playing" : ""}`}
                  onClick={playCry}
               >
                  ▶ Play Cry
               </button>

               <div className="cry-bar" aria-hidden="true">
                  <div className="cry-bar-fill" ref={fillRef} />
               </div>
            </div>
         </section>
      </div>
   );
}

export default DetailPage;