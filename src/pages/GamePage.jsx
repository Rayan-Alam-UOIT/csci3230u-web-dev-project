import { useEffect, useState } from "react";

const MOCK_ROUNDS = [
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

function GamePage() {
  const [activeGame, setActiveGame] = useState(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    document.title = "Pokéweb - Games";
  }, []);

  const round = MOCK_ROUNDS[roundIndex];
  const isFinished = roundIndex >= MOCK_ROUNDS.length;
  const isCorrect = selected === round?.name;

  function startGame(game) {
    if (game !== "silhouette") return;
    setActiveGame(game);
    setRoundIndex(0);
    setSelected("");
    setRevealed(false);
    setScore(0);
  }

  function handleSubmit() {
    if (!selected || revealed) return;
    if (isCorrect) setScore((s) => s + 1);
    setRevealed(true);
  }

  function handleNext() {
    setRoundIndex((i) => i + 1);
    setSelected("");
    setRevealed(false);
  }

  return (
    <div className="page container">
      <h1 className="page-title">Games</h1>
      <p className="page-subtitle">
        Choose a game to play.
      </p>

      <ul className="games-grid">
        <li className="game-card">
          <div className="game-card__image">
            <img
              src="/images/pokemon-game-1.png"
              alt={`A Pokémon silhouette next to a question mark, in the style of the "Who's That Pokémon?" TV segment`}
            />
          </div>
          <h2 className="game-card__name">
            {"Who's That Pokémon?"}
          </h2>
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
            <span 
              className="play-btn__icon" 
              aria-hidden="true"
            >
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
          <h2 className="game-card__name">
            Pokémon Clues
          </h2>
          <p className="game-card__desc">
            Guess the Pokémon using clues about its type, stats, and abilities.
          </p>
          <button 
            className="play-btn" 
            type="button" 
            data-game="clues"
          >
            <span>PLAY</span>
            <span 
              className="play-btn__icon" 
              aria-hidden="true"
            >
              <svg viewBox="0 0 16 16" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M4 2.5v11l10-5.5z" />
              </svg>
            </span>
          </button>
        </li>
      </ul>

      <h2 className="section-label">Game play area</h2>

      <section 
        className="game-play-area" 
        aria-label="Game play area"
      >
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
                {score} / {MOCK_ROUNDS.length}
              </strong>
              .
            </p>
            <button
              className="submit-btn"
              type="button"
              onClick={() => startGame("silhouette")}
            >
              Play again
            </button>
          </div>
        )}

        {activeGame === "silhouette" && !isFinished && (
          <div className="silhouette">
            <p className="silhouette__progress">
              Round {roundIndex + 1} of {MOCK_ROUNDS.length} · Score: {score}
            </p>

            <p className="game-play-area__prompt">{"Who's that Pokémon?"}</p>

            <div className="silhouette__stage">
              <img
                key={round.name}
                className={
                  "silhouette__img" +
                  (revealed ? " silhouette__img--revealed" : "")
                }
                src={round.image}
                alt={revealed ? round.name : "Silhouette of a hidden Pokémon"}
              />
            </div>

            <fieldset className="silhouette__options" disabled={revealed}>
              <legend className="visually-hidden">Answer choices</legend>
              {round.options.map((option) => {
                let state = "";
                if (revealed && option === round.name) state = " answer--correct";
                else if (revealed && option === selected) state = " answer--wrong";

                return (
                  <label
                    key={option}
                    className={
                      "answer" +
                      (selected === option ? " answer--selected" : "") +
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
              <button className="submit-btn" type="button" onClick={handleNext}>
                {roundIndex === MOCK_ROUNDS.length - 1 ? "See results" : "Next"}
              </button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default GamePage;