// AI-assisted - see AI-USAGE.md #<3>

import { useEffect, useMemo, useState } from "react";
import { CLUES_ROUND_COUNT, MIN_POKEMON_FOR_SILHOUETTE, SILHOUETTE_ROUND_COUNT } from "../constants/gameConstants";
import { useCluesGame, createCluesRounds } from "../hooks/useCluesGame";
import { useGuessAutocomplete } from "../hooks/useGuessAutocomplete";
import { usePokemonData } from "../hooks/usePokemonData";
import { useWhosThatPokemon, createSilhouetteRounds } from "../hooks/useWhosThatPokemon";
import { capitalize, chooseRandomPokemon } from "../utils/pokemonUtils";

function GamePage() {
   const [activeGame, setActiveGame] = useState(null);

   const pokemonData = usePokemonData();
   const cluesRounds = useMemo(
      () => createCluesRounds(pokemonData),
      [pokemonData],
   );
   const allNames = useMemo(
      () => pokemonData.map((pokemon) => capitalize(pokemon.name)),
      [pokemonData],
   );

   const cluesGame = useCluesGame();
   const silhouetteGame = useWhosThatPokemon();
   const autocomplete = useGuessAutocomplete({
      allNames,
      guesses: cluesGame.guesses,
      disabled: cluesGame.clueRoundComplete,
      onSubmit: cluesGame.submitGuess,
   });

   useEffect(() => {
      document.title = "Pokéweb - Games";
   }, []);

   const activeState =
      activeGame === "clues"
         ? cluesGame
         : activeGame === "silhouette"
            ? silhouetteGame
            : null;

   const isFinished = activeState?.finished ?? false;
   const maxScore = activeState?.maxScore ?? 0;

   const { currentRound: round, selected, revealed, isCorrect } = silhouetteGame;

   const pointsAvailable = cluesGame.clueCount - cluesGame.guesses.length;
   const guesses = cluesGame.guesses;

   function startGame(game) {
      if (game === "clues") {
         if (cluesRounds.length === 0) return;

         setActiveGame("clues");
         cluesGame.start(chooseRandomPokemon(cluesRounds, CLUES_ROUND_COUNT));
         autocomplete.reset();
         return;
      }

      if (game === "silhouette") {
         if (pokemonData.length < MIN_POKEMON_FOR_SILHOUETTE) return;

         setActiveGame("silhouette");
         silhouetteGame.start(createSilhouetteRounds(pokemonData, SILHOUETTE_ROUND_COUNT));
         return;
      }
   }

   return (
      <div className="page container">
         <h1 className="page-title">Games</h1>
         <p className="page-subtitle">Choose a game to play.</p>

         <ul className="games-grid">
            <li className="game-card">
               <div className="game-card__image">
                  <img
                     src="/images/pokemon-game-1.png"
                     alt={`A Pokémon silhouette next to a question mark, in the style of the "Who's That Pokémon?" TV segment`}
                  />
               </div>
               <h2 className="game-card__name">{"Who's That Pokémon?"}</h2>
               <p className="game-card__desc">
                  Identify the Pokémon shown from its silhouette or image.
               </p>
               <button
                  className="play-btn"
                  type="button"
                  data-game="silhouette"
                  onClick={() => startGame("silhouette")}
               >
                  <span>PLAY</span>
                  <span className="play-btn__icon" aria-hidden="true">
                     <svg
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M4 2.5v11l10-5.5z" />
                     </svg>
                  </span>
               </button>
            </li>

            <li className="game-card">
               <div className="game-card__image">
                  <img
                     src="/images/pokemon-game-2.png"
                     alt="Pokémon Trivia banner with a grid of Pokémon character icons"
                  />
               </div>
               <h2 className="game-card__name">Pokémon Clues</h2>
               <p className="game-card__desc">
                  Guess the Pokémon using clues about its type, stats, and
                  abilities.
               </p>
               <button
                  className="play-btn"
                  type="button"
                  data-game="clues"
                  onClick={() => startGame("clues")}
               >
                  <span>PLAY</span>
                  <span className="play-btn__icon" aria-hidden="true">
                     <svg
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M4 2.5v11l10-5.5z" />
                     </svg>
                  </span>
               </button>
            </li>
         </ul>

         <h2 className="section-label">Game play area</h2>

         <section className="game-play-area" aria-label="Game play area">
            {!activeGame && (
               <p className="game-play-area__prompt">
                  Select a game above to start playing.
               </p>
            )}

            {activeGame && isFinished && (
               <div className="silhouette-result">
                  <p className="game-play-area__prompt">
                     Game over! You scored{" "}
                     <strong>
                        {activeState.score} / {maxScore}
                     </strong>
                     .
                  </p>
                  <p className="game-play-area__prompt">
                     Best score: {activeState.bestScore} / {maxScore}
                  </p>
                  <button
                     className="submit-btn"
                     type="button"
                     onClick={() => startGame(activeGame)}
                  >
                     Play again
                  </button>
               </div>
            )}

            {activeGame === "silhouette" && !isFinished && (
               <div className="silhouette">
                  <p className="silhouette__progress">
                     Round {silhouetteGame.roundIndex + 1} of {silhouetteGame.roundCount} · Score: {silhouetteGame.score}
                  </p>

                  <p className="game-play-area__prompt">
                     {"Who's that Pokémon?"}
                  </p>

                  <div className="silhouette__stage">
                     <img
                        key={round.name}
                        className={
                           "silhouette__img" +
                           (revealed ? " silhouette__img--revealed" : "")
                        }
                        src={round.image}
                        alt={
                           revealed
                              ? round.name
                              : "Silhouette of a hidden Pokémon"
                        }
                     />
                  </div>

                  <fieldset className="silhouette__options" disabled={revealed}>
                     <legend className="visually-hidden">Answer choices</legend>
                     {round.options.map((option) => {
                        let state = "";
                        if (revealed && option === round.name)
                           state = " answer--correct";
                        else if (revealed && option === selected)
                           state = " answer--wrong";

                        return (
                           <label
                              key={option}
                              className={
                                 "answer" +
                                 (selected === option
                                    ? " answer--selected"
                                    : "") +
                                 state
                              }
                           >
                              <input
                                 type="radio"
                                 name="answer"
                                 value={option}
                                 checked={selected === option}
                                 onChange={() => silhouetteGame.select(option)}
                              />
                              <span>{option}</span>
                           </label>
                        );
                     })}
                  </fieldset>

                  {revealed && (
                     <p
                        className={
                           "silhouette__feedback " +
                           (isCorrect
                              ? "silhouette__feedback--correct"
                              : "silhouette__feedback--wrong")
                        }
                        role="status"
                     >
                        {isCorrect
                           ? `Correct! It's ${round.name}!`
                           : `Not quite. It's ${round.name}.`}
                     </p>
                  )}

                  {!revealed ? (
                     <button
                        className="submit-btn"
                        type="button"
                        onClick={silhouetteGame.submit}
                        disabled={!selected}
                     >
                        Submit
                     </button>
                  ) : (
                     <button
                        className="submit-btn"
                        type="button"
                        onClick={silhouetteGame.nextRound}
                     >
                        {silhouetteGame.roundIndex === silhouetteGame.roundCount - 1
                           ? "See results"
                           : "Next"}
                     </button>
                  )}
               </div>
            )}

            {activeGame === "clues" && !isFinished && (
               <div className="clues">
                  <p className="silhouette__progress">
                     Round {cluesGame.clueRoundIndex + 1} of{" "}
                     {cluesGame.clueRoundCount} · Score: {cluesGame.score}
                     {!cluesGame.clueRoundComplete &&
                        ` · Worth ${pointsAvailable} point${
                           pointsAvailable === 1 ? "" : "s"
                        }`}
                  </p>

                  <p className="game-play-area__prompt">
                     Which Pokémon is it? Each wrong guess unlocks another clue.
                  </p>

                  <dl className="clues__list">
                     {cluesGame.visibleClues.map((clue) => (
                        <div className="clues__item" key={clue.label}>
                           <dt>{clue.label}</dt>
                           <dd
                              className={
                                 "clues__value" +
                                 (clue.typeClass ? ` ${clue.typeClass}` : "")
                              }
                           >
                              {clue.typeClass ? clue.value.toUpperCase() : clue.value}
                           </dd>
                        </div>
                     ))}
                  </dl>

                  {guesses.length > 0 && (
                     <ul className="clues__guesses" aria-label="Your guesses">
                        {guesses.map((g, i) => (
                           <li
                              key={i}
                              className={
                                 "clues__guess" +
                                 (g.correct
                                    ? " clues__guess--correct"
                                    : " clues__guess--wrong")
                              }
                           >
                              {g.text}
                           </li>
                        ))}
                     </ul>
                  )}

                  {cluesGame.clueRoundComplete && (
                     <p
                        className={
                           "silhouette__feedback " +
                           (cluesGame.isCorrect
                              ? "silhouette__feedback--correct"
                              : "silhouette__feedback--wrong")
                        }
                        role="status"
                     >
                        {cluesGame.isCorrect
                           ? `Correct! It's ${cluesGame.currentPokemon.name}! You earned ${cluesGame.pointsEarnedThisRound} point${
                                cluesGame.pointsEarnedThisRound === 1 ? "" : "s"
                             }.`
                           : `Out of clues. It was ${cluesGame.currentPokemon.name}.`}
                     </p>
                  )}

                  {!cluesGame.clueRoundComplete ? (
                     <form
                        className="clues__form"
                        onSubmit={autocomplete.handleSubmit}
                     >
                        <label
                           className="visually-hidden"
                           htmlFor="clues-guess"
                        >
                           Your guess
                        </label>
                        <div className="clues__combobox">
                           <input
                              id="clues-guess"
                              className="clues__input"
                              type="text"
                              role="combobox"
                              aria-expanded={autocomplete.listOpen}
                              aria-controls="clues-suggestions"
                              aria-autocomplete="list"
                              aria-activedescendant={
                                 autocomplete.listOpen &&
                                 autocomplete.activeIndex >= 0
                                    ? `clues-option-${autocomplete.activeIndex}`
                                    : undefined
                              }
                              value={autocomplete.guess}
                              onChange={(e) =>
                                 autocomplete.handleChange(e.target.value)
                              }
                              onKeyDown={autocomplete.handleKeyDown}
                              onBlur={autocomplete.hideSuggestions}
                              placeholder="Start typing a Pokémon name"
                              autoComplete="off"
                              autoFocus
                           />
                           {autocomplete.listOpen && (
                              <ul
                                 id="clues-suggestions"
                                 className="clues__suggestions"
                                 role="listbox"
                              >
                                 {autocomplete.suggestions.map((name, i) => (
                                    <li
                                       key={name}
                                       id={`clues-option-${i}`}
                                       role="option"
                                       aria-selected={i === autocomplete.activeIndex}
                                       className={
                                          "clues__suggestion" +
                                          (i === autocomplete.activeIndex
                                             ? " clues__suggestion--active"
                                             : "")
                                       }
                                       onMouseDown={(e) => {
                                          e.preventDefault();
                                          autocomplete.chooseSuggestion(name);
                                       }}
                                    >
                                       {name}
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>
                        <button
                           className="submit-btn"
                           type="submit"
                           disabled={!autocomplete.canGuess}
                        >
                           Guess
                        </button>
                     </form>
                  ) : (
                     <button
                        className="submit-btn"
                        type="button"
                        onClick={cluesGame.nextRound}
                     >
                        {cluesGame.clueRoundIndex ===
                        cluesGame.clueRoundCount - 1
                           ? "See results"
                           : "Next"}
                     </button>
                  )}
               </div>
            )}
         </section>
      </div>
   );
}

export default GamePage;