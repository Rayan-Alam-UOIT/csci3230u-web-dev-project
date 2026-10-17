import { useEffect, useMemo, useState } from "react";

const SILHOUETTE_ROUNDS = [
   {
      name: "Pikachu",
      image: "/data/sprites/official-artwork/front_default/pikachu.png",
      options: ["Eevee", "Pikachu", "Ditto", "Squirtle"],
   },
   {
      name: "Charmander",
      image: "/data/sprites/official-artwork/front_default/charmander.png",
      options: ["Charmander", "Cyndaquil", "Totodile", "Bulbasaur"],
   },
   {
      name: "Mewtwo",
      image: "/data/sprites/official-artwork/front_default/mewtwo.png",
      options: ["Ditto", "Eevee", "Mewtwo", "Chikorita"],
   },
   {
      name: "Eevee",
      image: "/data/sprites/official-artwork/front_default/eevee.png",
      options: ["Pikachu", "Squirtle", "Ditto", "Eevee"],
   },
];

const CLUES_ROUNDS = [
   {
      name: "Pikachu",
      gen: 1,
      type1: "Electric",
      type2: null,
      height: 0.4,
      weight: 6.0,
      options: ["Eevee", "Pikachu", "Ditto", "Squirtle"],
   },
   {
      name: "Charmander",
      gen: 1,
      type1: "Fire",
      type2: null,
      height: 0.6,
      weight: 8.5,
      options: ["Charmander", "Cyndaquil", "Totodile", "Bulbasaur"],
   },
   {
      name: "Mewtwo",
      gen: 1,
      type1: "Psychic",
      type2: null,
      height: 2.0,
      weight: 122.0,
      options: ["Ditto", "Eevee", "Mewtwo", "Chikorita"],
   },
   {
      name: "Eevee",
      gen: 1,
      type1: "Normal",
      type2: null,
      height: 0.3,
      weight: 6.5,
      options: ["Pikachu", "Squirtle", "Ditto", "Eevee"],
   },
];

const ROUNDS_BY_GAME = {
   silhouette: SILHOUETTE_ROUNDS,
   clues: CLUES_ROUNDS,
};

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
      { label: "Height", value: `${pokemon.height.toFixed(1)} m` },
      { label: "Weight", value: `${pokemon.weight.toFixed(1)} kg` },
   ];
}

const CLUE_COUNT = generateClues(CLUES_ROUNDS[0]).length;

function useCluesGame() {
   const [started, setStarted] = useState(false);
   const [finished, setFinished] = useState(false);
   const [roundIndex, setRoundIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [guesses, setGuesses] = useState([]);
   const [revealedCount, setRevealedCount] = useState(1);
   const [roundComplete, setRoundComplete] = useState(false);

   const round = CLUES_ROUNDS[roundIndex];
   const clues = round ? generateClues(round) : [];

   function start() {
      setStarted(true);
      setFinished(false);
      setRoundIndex(0);
      setScore(0);
      setGuesses([]);
      setRevealedCount(1);
      setRoundComplete(false);
   }

   function submitGuess(value) {
      if (!started || finished || roundComplete || !round) return;

      const guess = value.trim();
      if (!guess) return;

      const correct = normalize(guess) === normalize(round.name);
      const nextGuesses = [...guesses, { text: guess, correct }];
      setGuesses(nextGuesses);

      if (correct) {
         const points = clues.length - guesses.length;
         setScore((current) => current + points);
         setRoundComplete(true);
      } else if (nextGuesses.length >= clues.length) {
         setRevealedCount(clues.length);
         setRoundComplete(true);
      } else {
         setRevealedCount(nextGuesses.length + 1);
      }
   }

   function nextRound() {
      if (!roundComplete) return;

      if (roundIndex === CLUES_ROUNDS.length - 1) {
         setFinished(true);
         return;
      }

      setRoundIndex((index) => index + 1);
      setGuesses([]);
      setRevealedCount(1);
      setRoundComplete(false);
   }

   const isCorrect = guesses.some((item) => item.correct);
   const roundPoints = isCorrect ? clues.length - (guesses.length - 1) : 0;

   return {
      started,
      finished,
      round,
      score,
      guesses,
      visibleClues: clues.slice(0, revealedCount),
      roundComplete,
      roundIndex,
      isCorrect,
      roundPoints,
      clueCount: clues.length,
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
   const [roundIndex, setRoundIndex] = useState(0);
   const [selected, setSelected] = useState("");
   const [revealed, setRevealed] = useState(false);
   const [score, setScore] = useState(0);

   const [guess, setGuess] = useState("");
   const [allNames, setAllNames] = useState([]);
   const [activeIndex, setActiveIndex] = useState(-1);
   const [showSuggestions, setShowSuggestions] = useState(false);

   const cluesGame = useCluesGame();

   useEffect(() => {
      document.title = "Pokéweb - Games";

      fetch("/data/sample.json")
         .then((response) => response.json())
         .then((data) =>
            setAllNames(data.pokemon.map((p) => capitalize(p.name))),
         )
         .catch(() => setAllNames([]));
   }, []);

   const rounds = activeGame ? ROUNDS_BY_GAME[activeGame] : [];
   const round = rounds[roundIndex];
   const isFinished =
      activeGame === "clues"
         ? cluesGame.finished
         : activeGame === "silhouette" && roundIndex >= rounds.length;

   const maxScore =
      activeGame === "clues" ? rounds.length * CLUE_COUNT : rounds.length;

   const isCorrect = selected === round?.name;

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
      showSuggestions && suggestions.length > 0 && !cluesGame.roundComplete;

   function resetRound() {
      setSelected("");
      setRevealed(false);
      setGuess("");
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function startGame(game) {
      if (!ROUNDS_BY_GAME[game]) return;
      setActiveGame(game);

      if (game === "clues") {
         cluesGame.start();
         setGuess("");
         setActiveIndex(-1);
         setShowSuggestions(false);
         return;
      }

      setRoundIndex(0);
      setScore(0);
      resetRound();
   }

   function handleSubmit() {
      if (!selected || revealed) return;
      if (isCorrect) setScore((s) => s + 1);
      setRevealed(true);
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

      if (!canGuess || cluesGame.roundComplete) return;
      const text = matchedName ?? guess.trim();

      cluesGame.submitGuess(text);
      setGuess("");
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function handleNext() {
      setRoundIndex((i) => i + 1);
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
                        {activeGame === "clues" ? cluesGame.score : score} /{" "}
                        {maxScore}
                     </strong>
                     .
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
                     Round {roundIndex + 1} of {rounds.length} · Score: {score}
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
                                 onChange={() => setSelected(option)}
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
                        onClick={handleSubmit}
                        disabled={!selected}
                     >
                        Submit
                     </button>
                  ) : (
                     <button
                        className="submit-btn"
                        type="button"
                        onClick={handleNext}
                     >
                        {roundIndex === rounds.length - 1
                           ? "See results"
                           : "Next"}
                     </button>
                  )}
               </div>
            )}

            {activeGame === "clues" && !isFinished && (
               <div className="clues">
                  <p className="silhouette__progress">
                     Round {cluesGame.roundIndex + 1} of {rounds.length} ·
                     Score: {cluesGame.score}
                     {!cluesGame.roundComplete &&
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
                              {clue.value}
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

                  {cluesGame.roundComplete && (
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
                           ? `Correct! It's ${cluesGame.round.name}! You earned ${cluesGame.roundPoints} point${
                                cluesGame.roundPoints === 1 ? "" : "s"
                             }.`
                           : `Out of clues. It was ${cluesGame.round.name}.`}
                     </p>
                  )}

                  {!cluesGame.roundComplete ? (
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
                        {cluesGame.roundIndex === rounds.length - 1
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
