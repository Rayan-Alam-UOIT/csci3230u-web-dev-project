import { useEffect } from "react";

function GamePage() {
  useEffect(() => {
    document.title = "Pokéweb - Games";
  }, []);

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
              src="public/images/pokemon-game-1.png"
              alt='A Pokémon silhouette next to a question mark, in the style of the "Who&apos;s That Pokémon?" TV segment'
            />
          </div>

          <h2 className="game-card__name">
            Who&apos;s That Pokémon?
          </h2>

          <p className="game-card__desc">
            Identify the Pokémon shown from its silhouette or
            image.
          </p>

          <button
            className="play-btn"
            type="button"
            data-game="silhouette"
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
              src="public/images/pokemon-game-2.png"
              alt="Pokémon Trivia banner with a grid of Pokémon character icons"
            />
          </div>

          <h2 className="game-card__name">
            Pokémon Clues
          </h2>

          <p className="game-card__desc">
            Guess the Pokémon using clues about its type, stats,
            and abilities.
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

      <section
        className="game-play-area"
        aria-label="Game play area"
      >
        <p className="game-play-area__prompt">
          Selected game interface / question appears here
        </p>

        <div className="game-play-area__answers">
          [ answer choices ]
        </div>

        <button className="submit-btn" type="button">
          Submit
        </button>
      </section>
    </div>
  );
}

export default GamePage;