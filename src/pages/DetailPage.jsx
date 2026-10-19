import { Fragment, useEffect, useState, useRef } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useFavourites } from "../hooks/useFavourites";

function DetailPage() {
   const [pokemon, setPokemon] = useState(null);
   const [pokemonList, setPokemonList] = useState([]);
   const { isFavourite, toggleFavourite } = useFavourites();
   const audioRef = useRef(null);
   const fillRef = useRef(null);
   const rafRef = useRef(null);
   const [isPlaying, setIsPlaying] = useState(false);

   const cryPath = pokemon?.cries.latest;

   const { id } = useParams();

   const location = useLocation();
   const origin = location.state?.from ?? "/";
   const originLabel = origin === "/favourites" ? "Favourites" : "Pokémon";

   useEffect(() => {
      document.title = "Pokéweb - Details";

      fetch("/data/sample.json")
         .then((response) => response.json())
         .then((data) => {
            setPokemonList(data.pokemon);

            const selectedPokemon = data.pokemon.find(
               (item) => String(item.id) === id,
            );

            setPokemon(selectedPokemon ?? null);
         });
   }, [id]);

   useEffect(() => {
      if (!cryPath) {
         return;
      }

      let stopped = false;

      const audio = new Audio(`/${cryPath}`);
      audio.preload = "auto";
      audioRef.current = audio;

      function tick() {
         if (stopped) {
            return;
         }
         if (audio.duration && fillRef.current) {
            fillRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
         }
         if (!audio.paused && !audio.ended) {
            rafRef.current = requestAnimationFrame(tick);
         }
      }

      function onPlaying() {
         if (stopped) {
            return;
         }
         setIsPlaying(true);
         tick();
      }

      function onEnded() {
         if (stopped) {
            return;
         }
         cancelAnimationFrame(rafRef.current);
         if (fillRef.current) {
            fillRef.current.style.width = "100%";
         }
         setIsPlaying(false);

         setTimeout(() => {
            if (fillRef.current && audio.ended)
               fillRef.current.style.width = "0%";
         }, 250);
      }

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("ended", onEnded);

      return () => {
         stopped = true;
         cancelAnimationFrame(rafRef.current);
         audio.pause();
         audio.removeEventListener("playing", onPlaying);
         audio.removeEventListener("ended", onEnded);
         if (fillRef.current) {
            fillRef.current.style.width = "0%";
         }
         setIsPlaying(false);
      };
   }, [cryPath]);

   if (!pokemon) {
      return null;
   }

   const currentIndex = pokemonList.findIndex(
      (item) => item.id === pokemon.id,
   );
   const previousPokemon = pokemonList[currentIndex - 1];
   const nextPokemon = pokemonList[currentIndex + 1];

   const formattedName =
      pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

   const types = pokemon.types.map((item) => item.type.name);

   const abilities = pokemon.abilities
      .map((item) => {
         const formattedAbility = item.ability.name
            .replace(/-/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

         return formattedAbility;
      })
      .join(", ");

   const eggGroups = pokemon.egg_groups
      .map((item) =>
         item.name
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
      )
      .join(" / ");

   const stats = pokemon.stats;

   const moves = pokemon.moves;

   const sprites =
      pokemon.sprites.versions["generation-iv"]["heartgold-soulsilver"];

   const officialArtwork =
      pokemon.sprites.other["official-artwork"].front_default;

   const shinyArtwork = pokemon.sprites.other["official-artwork"].front_shiny;

   const cry = pokemon.cries.latest;

   function playCry() {
      const audio = audioRef.current;
      if (!audio) {
         return;
      }

      cancelAnimationFrame(rafRef.current);
      fillRef.current.style.width = "0%";
      setIsPlaying(false);

      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(() => {});
   }

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
                        <span className="card-label">HP:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find((item) => item.stat.name === "hp")
                                 .base_stat
                           }{" "}
                        </span>

                        <span className="card-label">Attack:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find((item) => item.stat.name === "attack")
                                 .base_stat
                           }{" "}
                        </span>

                        <span className="card-label">Defense:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find((item) => item.stat.name === "defense")
                                 .base_stat
                           }{" "}
                        </span>

                        <span className="card-label">Sp. Atk:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find(
                                 (item) => item.stat.name === "special-attack",
                              ).base_stat
                           }{" "}
                        </span>

                        <span className="card-label">Sp. Def:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find(
                                 (item) => item.stat.name === "special-defense",
                              ).base_stat
                           }{" "}
                        </span>

                        <span className="card-label">Speed:</span>
                        <span className="card-value">
                           {" "}
                           {
                              stats.find((item) => item.stat.name === "speed")
                                 .base_stat
                           }{" "}
                        </span>
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
                                 {item.move.name
                                    .split(/[ -]+/)
                                    .map(
                                       (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1),
                                    )
                                    .join(" ")}
                                 :
                              </span>

                              <span
                                 className={`card-value type type-${item.move.type}`}
                              >
                                 {item.move.type
                                    .split("-")
                                    .map(
                                       (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1),
                                    )
                                    .join(" ")}
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
                  <li>
                     <button
                        type="button"
                        className="sprite-link"
                        popoverTarget="sprite-front"
                     >
                        <img
                           src={`/${sprites.front_default}`}
                           alt={`${formattedName} front sprite`}
                           className="sprite-img"
                        />
                     </button>

                     <img
                        popover="auto"
                        id="sprite-front"
                        className="sprite-popover"
                        src={`/${sprites.front_default}`}
                        alt={`${formattedName} front sprite, enlarged`}
                     />
                  </li>

                  <li>
                     <button
                        type="button"
                        className="sprite-link"
                        popoverTarget="sprite-back"
                     >
                        <img
                           src={`/${sprites.back_default}`}
                           alt={`${formattedName} back sprite`}
                           className="sprite-img"
                        />
                     </button>

                     <img
                        popover="auto"
                        id="sprite-back"
                        className="sprite-popover"
                        src={`/${sprites.back_default}`}
                        alt={`${formattedName} back sprite, enlarged`}
                     />
                  </li>

                  <li>
                     <button
                        type="button"
                        className="sprite-link"
                        popoverTarget="sprite-shiny-front"
                     >
                        <img
                           src={`/${sprites.front_shiny}`}
                           alt={`${formattedName} shiny front sprite`}
                           className="sprite-img"
                        />
                     </button>

                     <img
                        popover="auto"
                        id="sprite-shiny-front"
                        className="sprite-popover"
                        src={`/${sprites.front_shiny}`}
                        alt={`${formattedName} shiny front sprite, enlarged`}
                     />
                  </li>

                  <li>
                     <button
                        type="button"
                        className="sprite-link"
                        popoverTarget="sprite-shiny-back"
                     >
                        <img
                           src={`/${sprites.back_shiny}`}
                           alt={`${formattedName} shiny back sprite`}
                           className="sprite-img"
                        />
                     </button>

                     <img
                        popover="auto"
                        id="sprite-shiny-back"
                        className="sprite-popover"
                        src={`/${sprites.back_shiny}`}
                        alt={`${formattedName} shiny back sprite, enlarged`}
                     />
                  </li>
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
