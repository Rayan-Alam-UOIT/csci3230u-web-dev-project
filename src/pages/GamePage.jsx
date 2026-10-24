import { useEffect, useMemo, useState } from "react";

const GENERATION_NUMBERS = {
   i: 1,
   ii: 2,
   iii: 3,
   iv: 4,
   v: 5,
   vi: 6,
   vii: 7,
   viii: 8,
   ix: 9,
};

function shuffle(list) {
   return chooseRandomPokemon(list, list.length); // reuse: picks everything in random order
}

function useWhosThatPokemon() {
   const [rounds, setRounds] = useState([]);
   const [started, setStarted] = useState(false);
   const [finished, setFinished] = useState(false);
   const [roundIndex, setRoundIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [selected, setSelected] = useState("");
   const [revealed, setRevealed] = useState(false);
   const [bestScore, setBestScore] = useState(() => {
      const saved = Number(localStorage.getItem("whos-best-score"));
      return Number.isFinite(saved) && saved >= 0 ? saved : 0;
   });

   const currentRound = rounds[roundIndex];
   const isCorrect =
      revealed && normalize(selected) === normalize(currentRound?.name ?? "");


   function start(newRounds) {
      // Copied from clues minigame logic
      if (newRounds.length === 0) return;

      setRounds(newRounds);
      setStarted(true);
      setFinished(false);
      setRoundIndex(0);
      setScore(0);
      setSelected("");
      setRevealed(false);
   }

   function select(option) {
      if (!started || finished || revealed) return;
      setSelected(option);
   }

   function submit() {
      // Copied from submitGuess logic
      if (!started || finished || revealed || !selected) return;

      const correct = normalize(selected) === normalize(currentRound.name);
      if (correct) setScore((s) => s + 1);
      setRevealed(true);
   }

   function nextRound() {
      // Copied from clues minigame logic
      if (!revealed) return;

      if (roundIndex === rounds.length - 1) {
         setFinished(true);
         if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("whos-best-score", String(score));
         }
         return;
      }

      setRoundIndex((i) => i + 1);
      setSelected("");
      setRevealed(false);
   }

   return {
      started, finished, score, bestScore, selected, revealed, isCorrect,
      currentRound, roundIndex,
      roundCount: rounds.length,
      maxScore: rounds.length,
      start, select, submit, nextRound,
   };
}

function createSilhouetteRounds(pokemonList, count) {
   const picks = chooseRandomPokemon(pokemonList, count);

   return picks.map((pokemon) => {
      const distractors = chooseRandomPokemon(
         pokemonList.filter((p) => p.name !== pokemon.name),
         3,
      );

      return {
         name: capitalize(pokemon.name),
         image: `/data/sprites/official-artwork/front_default/${pokemon.name}.png`,
         options: shuffle([pokemon, ...distractors]).map((p) =>
            capitalize(p.name),
         ),
      };
   });
}

// Map each record to the field that clues will need
function createCluesRounds(pokemonList) {
   return pokemonList.map((pokemon) => {
      const generationKey =
         pokemon.generation?.name?.replace("generation-", "") ?? "";

      return {
         name: capitalize(pokemon.name),
         gen: GENERATION_NUMBERS[generationKey] ?? generationKey,
         type1:
            pokemon.types.find((entry) => entry.slot === 1)?.type.name ??
            "Unknown",
         type2:
            pokemon.types.find((entry) => entry.slot === 2)?.type.name ?? null,
         height: pokemon.height / 10,
         weight: pokemon.weight / 10,
      };
   });
}

/** pick rand pokemon then remove from a copy of available rounds
 * (rounds should be og sample list)
 *  just to make sure same pokemon not picked twice (also makes sure each game is random)
 */
function chooseRandomPokemon(rounds, count) {
   const available = [...rounds];
   const chosen = [];

   while (chosen.length < count && available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      chosen.push(available.splice(randomIndex, 1)[0]);
   }

   return chosen;
}

// build clue list for each pokemon that's given in param
function generateClues(pokemon) {
   return [
      { label: "Generation", value: String(pokemon.gen) },
      {
         label: "Type 1",
         value: pokemon.type1,
         typeClass: `type type-${pokemon.type1.toLowerCase()}`,
      },
      {
         label: "Type 2",
         value: pokemon.type2 ?? "None",
         typeClass: pokemon.type2
            ? `type type-${pokemon.type2.toLowerCase()}`
            : "",
      },
      { label: "Height", value: `${pokemon.height.toFixed(1)}m` },
      { label: "Weight", value: `${pokemon.weight.toFixed(1)} kg` },
   ];
}

// Separated game state
function useCluesGame() {
   const [clueRounds, setClueRounds] = useState([]);
   const [started, setStarted] = useState(false);
   const [finished, setFinished] = useState(false);
   const [clueRoundIndex, setClueRoundIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [bestScore, setBestScore] = useState(() => {
      const savedScore = Number(localStorage.getItem("clues-best-score"));
      return Number.isFinite(savedScore) && savedScore >= 0 ? savedScore : 0;
   });
   const [guesses, setGuesses] = useState([]);
   const [revealedCount, setRevealedCount] = useState(1);
   const [clueRoundComplete, setClueRoundComplete] = useState(false);

   const currentPokemon = clueRounds[clueRoundIndex];
   const clues = currentPokemon ? generateClues(currentPokemon) : [];

   function start(newRounds) {
      if (newRounds.length === 0) return;

      setClueRounds(newRounds);
      setStarted(true);
      setFinished(false);
      setClueRoundIndex(0);
      setScore(0);
      setGuesses([]);
      setRevealedCount(1);
      setClueRoundComplete(false);
   }

   function submitGuess(value) {
      if (!started || finished || clueRoundComplete || !currentPokemon) return;

      const guess = value.trim();
      if (!guess) return;

      const correct = normalize(guess) === normalize(currentPokemon.name);
      const nextGuesses = [...guesses, { text: guess, correct }];
      setGuesses(nextGuesses);

      if (correct) {
         const points = clues.length - guesses.length;
         setScore((current) => current + points);
         setClueRoundComplete(true);
      } else if (nextGuesses.length >= clues.length) {
         setRevealedCount(clues.length);
         setClueRoundComplete(true);
      } else {
         setRevealedCount(nextGuesses.length + 1);
      }
   }

   function nextRound() {
      if (!clueRoundComplete) return;

      if (clueRoundIndex === clueRounds.length - 1) {
         setFinished(true);
         if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("clues-best-score", String(score));
         }
         return;
      }

      setClueRoundIndex((index) => index + 1);
      setGuesses([]);
      setRevealedCount(1);
      setClueRoundComplete(false);
   }

   const isCorrect = guesses.some((item) => item.correct);
   const pointsEarnedThisRound = isCorrect
      ? clues.length - (guesses.length - 1)
      : 0;

   return {
      started,
      finished,
      currentPokemon,
      score,
      bestScore,
      maxScore:
         clueRounds.length *
         (clueRounds.length > 0 ? generateClues(clueRounds[0]).length : 0),
      guesses,
      visibleClues: clues.slice(0, revealedCount),
      clueRoundComplete,
      clueRoundIndex,
      isCorrect,
      pointsEarnedThisRound,
      clueCount: clues.length,
      clueRoundCount: clueRounds.length,
      start,
      submitGuess,
      nextRound,
   };
}

function normalize(text) {
   return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
}

function capitalize(name) {
   return name.charAt(0).toUpperCase() + name.slice(1);
}

const MAX_SUGGESTIONS = 8;

function GamePage() {
   const [activeGame, setActiveGame] = useState(null);

   const [guess, setGuess] = useState("");
   const [pokemonData, setPokemonData] = useState([]);
   const [activeIndex, setActiveIndex] = useState(-1);
   const [showSuggestions, setShowSuggestions] = useState(false);

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

   useEffect(() => {
      document.title = "Pokéweb - Games";

      fetch("/data/sample.json")
         .then((response) => {
            if (!response.ok) {
               throw new Error(
                  `Failed to load Pokémon data: ${response.status}`,
               );
            }
            return response.json();
         })
         .then((data) => setPokemonData(data.pokemon))
         .catch((error) => {
            console.error(error);
            setPokemonData([]);
         });
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

   const suggestions = useMemo(() => {
      const query = normalize(guess);
      if (!query) return [];
      const guessed = new Set(guesses.map((g) => normalize(g.text)));
      const available = allNames.filter((n) => !guessed.has(normalize(n)));
      const starts = available.filter((n) => normalize(n).startsWith(query));
      const contains = available.filter(
         (n) => !normalize(n).startsWith(query) && normalize(n).includes(query),
      );
      return [...starts, ...contains].slice(0, MAX_SUGGESTIONS);
   }, [guess, guesses, allNames]);

   const matchedName = allNames.find((n) => normalize(n) === normalize(guess));
   const alreadyGuessed = guesses.some(
      (g) => normalize(g.text) === normalize(guess),
   );
   const canGuess =
      !alreadyGuessed &&
      (allNames.length === 0 ? guess.trim() !== "" : Boolean(matchedName));
   const listOpen =
      showSuggestions && suggestions.length > 0 && !cluesGame.clueRoundComplete;

   function resetRound() {
      setGuess("");
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function startGame(game) {
      if (game === "clues") {
         if (cluesRounds.length === 0) return;

         setActiveGame("clues");
         cluesGame.start(chooseRandomPokemon(cluesRounds, 4)); // Change the # to however many rounds u want
         resetRound();
         return;
      }

      if (game === "silhouette") {
         if (pokemonData.length < 4) return;

         setActiveGame("silhouette");
         silhouetteGame.start(createSilhouetteRounds(pokemonData, 4));
         return;
      }
   }

   function chooseSuggestion(name) {
      setGuess(name);
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function handleGuessKeyDown(event) {
      if (!listOpen) return;
      if (event.key === "ArrowDown") {
         event.preventDefault();
         setActiveIndex((i) => (i + 1) % suggestions.length);
      } else if (event.key === "ArrowUp") {
         event.preventDefault();
         setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      } else if (event.key === "Escape") {
         setShowSuggestions(false);
         setActiveIndex(-1);
      }
   }

   function handleGuess(event) {
      event.preventDefault();

      if (listOpen && activeIndex >= 0) {
         chooseSuggestion(suggestions[activeIndex]);
         return;
      }

      if (!canGuess || cluesGame.clueRoundComplete) return;
      const text = matchedName ?? guess.trim();

      cluesGame.submitGuess(text);
      resetRound();
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
                     <form className="clues__form" onSubmit={handleGuess}>
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
                              aria-expanded={listOpen}
                              aria-controls="clues-suggestions"
                              aria-autocomplete="list"
                              aria-activedescendant={
                                 listOpen && activeIndex >= 0
                                    ? `clues-option-${activeIndex}`
                                    : undefined
                              }
                              value={guess}
                              onChange={(e) => {
                                 setGuess(e.target.value);
                                 setActiveIndex(-1);
                                 setShowSuggestions(true);
                              }}
                              onKeyDown={handleGuessKeyDown}
                              onBlur={() => setShowSuggestions(false)}
                              placeholder="Start typing a Pokémon name"
                              autoComplete="off"
                              autoFocus
                           />
                           {listOpen && (
                              <ul
                                 id="clues-suggestions"
                                 className="clues__suggestions"
                                 role="listbox"
                              >
                                 {suggestions.map((name, i) => (
                                    <li
                                       key={name}
                                       id={`clues-option-${i}`}
                                       role="option"
                                       aria-selected={i === activeIndex}
                                       className={
                                          "clues__suggestion" +
                                          (i === activeIndex
                                             ? " clues__suggestion--active"
                                             : "")
                                       }
                                       onMouseDown={(e) => {
                                          e.preventDefault();
                                          chooseSuggestion(name);
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
                           disabled={!canGuess}
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
