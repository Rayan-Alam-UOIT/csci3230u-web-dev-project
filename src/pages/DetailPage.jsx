// AI-assisted - see AI-USAGE.md #<18, 21>

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
import { useMemo, useState } from "react";
import {
   MOVE_METHOD_ORDER,
   MOVE_METHOD_LABELS,
   getVersionGroups,
   groupMovesByMethod,
} from "../utils/moveUtils";

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
   const [selectedVersion, setSelectedVersion] = useState(null);

   const versionGroups = useMemo(
      () => getVersionGroups(pokemon?.moves ?? []),
      [pokemon],
   );
   const activeVersion = versionGroups.includes(selectedVersion)
      ? selectedVersion
      : versionGroups.at(-1);

   const groupedMoves = useMemo(
      () => groupMovesByMethod(pokemon?.moves ?? [], activeVersion),
      [pokemon, activeVersion],
   );

   const [prevId, setPrevId] = useState(id);
   if (id !== prevId) {
      setPrevId(id);
      setShowAllMoves(false);
   }

   if (status === "notFound") {
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

   const formattedName = capitalize(pokemon.name);

   const { types, is_legendary, is_mythical, stats, artwork } =
      pokemon;

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

   const MOVE_LIMIT = 12;

const methodsWithMoves = MOVE_METHOD_ORDER.filter(
   (m) => groupedMoves[m]?.length,
);
const totalMoves = methodsWithMoves.reduce(
   (sum, m) => sum + groupedMoves[m].length,
   0,
);

let initialLimit = showAllMoves ? Infinity : MOVE_LIMIT;
const { visibleGroups } = methodsWithMoves.reduce(
   (acc, method) => {
      const list = groupedMoves[method];
      const shown = list.slice(0, acc.remaining);

      if (shown.length > 0) {
         acc.visibleGroups.push({ method, list, shown });
      }
      acc.remaining -= shown.length;
      return acc;
   },
   { visibleGroups: [], remaining: initialLimit}
)

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

            <li className="pokedex-description">
               <h2>Pokédex Description</h2>
               <p>
                  {pokemon.description ?? "No Pokédex description available."}
               </p>
            </li>

            <EvolutionChain speciesId={pokemon.speciesId ?? pokemon.id} />
            
            <li className="body-wrapper">
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
                        <span className="detail-type">MOVES ({totalMoves})</span>

                        {versionGroups.length > 0 && (
                           <select
                              className="moves-version"
                              value={activeVersion}
                              onChange={(e) => setSelectedVersion(e.target.value)}
                              aria-label="Game version"
                           >
                              {versionGroups.map((group) => (
                                 <option key={group} value={group}>
                                    {titleCase(group)}
                                 </option>
                              ))}
                           </select>
                        )}
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

                     {visibleGroups.map(({ method, list, shown }) => (
                        <section key={method} className="moves-group">
                           <h3 className="moves-group-heading">
                              {MOVE_METHOD_LABELS[method]} ({list.length})
                           </h3>

                           <div className="moves-grid">
                              {shown.map((item) => (
                                 <div className="move-item" key={item.name}>
                                    <span className="move-name">
                                       {method === "level-up" && (
                                          <span className="move-level">Lv. {item.level}</span>
                                       )}
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
                        </section>
                     ))}

                     {totalMoves === 0 && <p>No moves available for this game.</p>}

                     {totalMoves > MOVE_LIMIT && (
                        <button
                           type="button"
                           className="moves-toggle"
                           onClick={() => setShowAllMoves((prev) => !prev)}
                           aria-expanded={showAllMoves}
                        >
                           {showAllMoves ? "Show Less" : `Show All ${totalMoves} Moves`}
                        </button>
                     )}
                  </li>
               </ul>
            </li>
         </ul>

         <section className="sprites-section body" aria-labelledby="sprites-heading">
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

                           {isPlaying ? (
                              <svg
                                 viewBox="0 0 24 24"
                                 aria-hidden="true"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeWidth="2.5"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                              >
                                 <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                                 <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                 <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                              </svg>
                           ) : (
                              <svg
                                 viewBox="0 0 24 24"
                                 aria-hidden="true"
                                 fill="currentColor"
                              >
                                 <path d="M8 5.5a1 1 0 0 1 1.52-.85l10 6.5a1 1 0 0 1 0 1.7l-10 6.5A1 1 0 0 1 8 18.5v-13Z" />
                              </svg>
                           )}

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
