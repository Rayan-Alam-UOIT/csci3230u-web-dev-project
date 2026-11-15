// AI-assisted - see AI-USAGE.md #<4>

import { useParams, Link, useLocation } from "react-router-dom";
import DataStatus from "../components/DataStatus";
import { BASE_STAT_ROWS, SPRITE_GROUPS, SPRITE_VARIANTS } from "../constants/detailConstants";
import { useCry } from "../hooks/useCry";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useFavourites } from "../hooks/useFavourites";
import { useMoveTypes } from "../hooks/useMoveTypes";
import { usePokemonNavigation } from "../hooks/usePokemonNavigation";
import { capitalize, titleCase } from "../utils/pokemonUtils";
import EvolutionChain from "../components/EvolutionChain";
import { useState } from "react";

function DetailPage() {
   useDocumentTitle("Pokéweb - Details");

   const { id } = useParams();
   const location = useLocation(); // AI-assisted

   const { pokemon, previousPokemon, nextPokemon, status, retry } =
      usePokemonNavigation(id, location.state?.navigationIds); // AI-assisted
   const { isFavourite, toggleFavourite } = useFavourites();
   const { play: playCry, isPlaying, fillRef } = useCry(pokemon?.cryUrl);

   const origin = location.state?.from ?? "/";
   const originLabel = origin === "/favourites" ? "Favourites" : "Pokémon";

   const {
      moveTypes,
      status: moveStatus,
      retry: retryMoves,
   } = useMoveTypes(pokemon?.moves);

   const [showAllMoves, setShowAllMoves] = useState(false);

   if (status !== "ok") {
      return (
         <div className="page container">
            <DataStatus
               status={status}
               onRetry={retry}
               loadingText="Loading Pokémon details…"
            />
         </div>
      );
   }

   if (!pokemon) {
      return (
         <div className="page container">
            <nav>
               <Link to={origin} className="back-button">
                  ‹ &nbsp; Back to {originLabel}
               </Link>
            </nav>
            <section className="empty-state-area" role="alert">
               <p>We couldn't find a Pokémon with that ID.</p>
            </section>
         </div>
      );
   }

   const formattedName = capitalize(pokemon.name);

   const { types, is_legendary, is_mythical, stats, moves, sprites, artwork } =
      pokemon;

   const visibleMoves = showAllMoves ? moves : moves.slice(0, 12);
   const availableSpriteGroups = SPRITE_GROUPS.map(({ key, label }) => {
      const source = pokemon.spriteSets?.[key] ?? (key === "blackWhiteAnimated" ? pokemon.sprites : null);

      return {
         key,
         label,
         sprites: SPRITE_VARIANTS.flatMap(({ key: variant, label: variantLabel }) =>
            source?.[variant]
               ? [{ key: variant, label: variantLabel, src: source[variant] }]
               : []
         ),
      };
   }).filter(({ sprites }) => sprites.length > 0);
   const hasSprites = availableSpriteGroups.length > 0;
   const hasCry = Boolean(pokemon.cryUrl);

   const abilities = pokemon.abilities.map(titleCase).join(", ");

   const eggGroups = pokemon.eggGroups.map(titleCase).join(" / ");

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
                     src={artwork.default}
                     alt={formattedName}
                  />
               </div>

               <div className="head-info">
                  <div className="head-title-row">
                     <h1 className="head-name">
                        <span className="dex-number">
                           #{String(pokemon.id).padStart(3, "0")}
                        </span>{" "}
                        {formattedName}
                     </h1>

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
                        {pokemon.heightM.toFixed(1)}m
                     </span>

                     <span className="card-label">Weight:</span>
                     <span className="card-value">
                        {pokemon.weightKg.toFixed(1)} kg
                     </span>

                     <span className="card-label">Abilities:</span>
                     <span className="card-value">{abilities}</span>

                     <span className="card-label">Egg Group:</span>
                     <span className="card-value">{eggGroups}</span>
                  </div>
                  <div className="artwork-shiny-section">
                     <ul className="artwork-shiny-grid">
                        <li>
                           <button
                              type="button"
                              className="artwork-shiny-thumb-btn"
                              popoverTarget="artwork-shiny"
                           >
                              <img
                                 src={artwork.shiny}
                                 alt={`${formattedName} shiny official artwork`}
                                 className="artwork-shiny-thumb-img"
                              />
                           </button>

                           <img
                              popover="auto"
                              id="artwork-shiny"
                              className="artwork-shiny-lightbox"
                              src={artwork.shiny}
                              alt={`${formattedName} shiny official artwork, enlarged`}
                           />
                        </li>
                     </ul>
                  </div>
               </div>
            </li>

            <section className="pokedex-description">
               <h2>Pokédex Description</h2>
               <p>
                  {pokemon.description ?? "No Pokédex description available."}
               </p>
            </section>

            <EvolutionChain speciesId={pokemon.speciesId ?? pokemon.id} />

            <ul className="body-list">
               <li className="body stats-card">
                  <div className="card-row">
                     <span className="detail-type">BASE STATS</span>
                  </div>

                  <div className="base-stats-grid">
                     {BASE_STAT_ROWS.map(({ label, stat }) => (
                        <div className="stat-item" key={stat}>
                           <span className="stat-label">
                              {label.replace(":", "")}
                           </span>
                           <span className="stat-value">{stats[stat]}</span>
                        </div>
                     ))}
                  </div>
               </li>

               <li className="body moves-card">
                  <div className="card-row">
                     <span className="detail-type">MOVES ({moves.length})</span>
                  </div>

                  {moveStatus === "loading" && (
                     <p role="status" aria-live="polite">
                        Loading move types…
                     </p>
                  )}

                  {moveStatus === "error" && (
                     <p role="alert">
                        Some move types couldn't be loaded.{" "}
                        <button type="button" onClick={retryMoves}>
                           Try again
                        </button>
                     </p>
                  )}

                  <div className="moves-grid">
                     {visibleMoves.map((item) => (
                        <div className="move-item" key={item.name}>
                           <span className="move-name">
                              {titleCase(item.name)}
                           </span>

                           {moveTypes[item.name] ? (
                              <span
                                 className={`card-value type type-${moveTypes[item.name]}`}
                              >
                                 {titleCase(moveTypes[item.name])}
                              </span>
                           ) : (
                              <span className="move-type-fallback">
                                 {moveStatus === "loading" ? "…" : "Unknown"}
                              </span>
                           )}
                        </div>
                     ))}
                  </div>
                  {moves.length > 12 && (
                     <button
                        type="button"
                        className="moves-toggle"
                        onClick={() => setShowAllMoves((prev) => !prev)}
                        aria-expanded={showAllMoves}
                     >
                        {showAllMoves
                           ? "Show Less"
                           : `Show All ${moves.length} Moves`}
                     </button>
                  )}
               </li>
            </ul>
         </ul>

         <section className="sprites-section" aria-labelledby="sprites-heading">
            <h2 id="sprites-heading" className="sprites-heading">
               Sprites &amp; Cry
            </h2>

            {!hasSprites && !hasCry && (
               <p className="empty-state-area">
                  No sprites or cry available for this Pokémon.
               </p>
            )}

            {(hasSprites || hasCry) && (
               <div className="sprites-row">
                  {hasSprites ? (
                     <div className="sprite-groups">
                        {availableSpriteGroups.map((group) => (
                           <section
                              key={group.key}
                              className="sprite-group"
                              aria-labelledby={`sprite-group-${group.key}`}
                           >
                              <h3
                                 id={`sprite-group-${group.key}`}
                                 className="sprite-group-heading"
                              >
                                 {group.label}
                              </h3>

                              <ul className="sprites-list">
                                 {group.sprites.map(({ key, label, src }) => {
                                    const popoverId = `sprite-${pokemon.id}-${group.key}-${key}`;
                                    const spriteLabel = `${formattedName} ${group.label} ${label}`;

                                    return (
                                       <li key={key} className="sprite-item">
                                          <button
                                             type="button"
                                             className="sprite-link"
                                             popoverTarget={popoverId}
                                             aria-label={`Enlarge ${spriteLabel}`}
                                          >
                                             <img
                                                src={src}
                                                alt={spriteLabel}
                                                className="sprite-img"
                                                loading="lazy"
                                             />
                                          </button>
                                          <span className="sprite-label">{label}</span>

                                          <img
                                             popover="auto"
                                             id={popoverId}
                                             className="sprite-popover"
                                             src={src}
                                             alt={`${spriteLabel}, enlarged`}
                                          />
                                       </li>
                                    );
                                 })}
                              </ul>
                           </section>
                        ))}
                     </div>
                  ) : (
                     <p>No sprites available for this Pokémon.</p>
                  )}

                  {hasCry && (
                     <div className="cry-player">
                        <button
                           type="button"
                           className={`play-sound ${isPlaying ? "playing" : ""}`}
                           onClick={playCry}
                           aria-label={`Play ${formattedName}'s cry`}
                        >
                           <i
                              className={`fa-solid ${isPlaying ? "fa-volume-high" : "fa-play"}`}
                              aria-hidden="true"
                           ></i>
                           <span>
                              {isPlaying ? "Playing Cry..." : "Play Cry"}
                           </span>
                        </button>

                        <div className="cry-bar" aria-hidden="true">
                           <div className="cry-bar-fill" ref={fillRef} />
                        </div>
                     </div>
                  )}
               </div>
            )}
         </section>

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
      </div>
   );
}

export default DetailPage;
