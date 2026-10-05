import { useEffect } from "react";

function DetailPage() {
  useEffect(() => {
    document.title = "Pokéweb - Details";
  }, []);

  return (
    <div className="page container">
      <nav>
        <a href="/" className="back-button">
          ‹ &nbsp; Back to Pokémon
        </a>
      </nav>

      <ul className="card-list">
        <li className="head">
          <div className="head-image">
            <img
              id="pokemon-img"
              src="/data/sprites/official-artwork/front_default/pikachu.png"
              alt="Pikachu"
              className="pokecard-image"
            />
          </div>

          <div className="head-info">
            <h1 className="head-name">
              <span className="dex-number">#025</span> Pikachu
            </h1>

            <div className="card-row">
              <span className="detail-type type-electric">ELECTRIC</span>

              <label className="fav">
                <input
                  type="checkbox"
                  aria-label="Favourite Pikachu"
                  defaultChecked
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
              <span className="card-value">0.4m</span>

              <span className="card-label">Weight:</span>
              <span className="card-value">6.0 kg</span>

              <span className="card-label">Abilities:</span>
              <span className="card-value">
                Static, Lightning Rod
              </span>

              <span className="card-label">Egg Group:</span>
              <span className="card-value">Field / Fairy</span>
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
                <span className="card-value">35</span>

                <span className="card-label">Attack:</span>
                <span className="card-value">55</span>

                <span className="card-label">Defense:</span>
                <span className="card-value">40</span>

                <span className="card-label">Sp. Atk</span>
                <span className="card-value">50</span>

                <span className="card-label">Sp. Def:</span>
                <span className="card-value">50</span>

                <span className="card-label">Speed:</span>
                <span className="card-value">90</span>
              </div>
            </li>

            <li className="body">
              <div className="card-row">
                <span className="detail-type">MOVES</span>
              </div>

              <div className="body-stats">
                <span className="card-label">Thunderbolt:</span>
                <span className="card-value type-electric">
                  Electric
                </span>

                <span className="card-label">Quick Attack:</span>
                <span className="card-value type-normal">
                  Normal
                </span>

                <span className="card-label">Iron Tail:</span>
                <span className="card-value type-steel">
                  Steel
                </span>

                <span className="card-label">Electro Ball:</span>
                <span className="card-value type-electric">
                  Electric
                </span>

                <span className="card-label">Volt Tackle:</span>
                <span className="card-value type-electric">
                  Electric
                </span>

                <span className="card-label">Agility:</span>
                <span className="card-value type-psychic">
                  Psychic
                </span>
              </div>
            </li>
          </ul>
        </li>
      </ul>

      <nav className="details-nav">
        <a href="#" className="nav-prev">
          &larr; Previous Pokemon
        </a>

        <a href="#" className="nav-next">
          Next Pokemon &rarr;
        </a>
      </nav>

      <section
        className="sprites-section"
        aria-labelledby="sprites-heading"
      >
        <h2 id="sprites-heading" className="sprites-heading">
          Sprites &amp; Cry
        </h2>

        <div className="sprites-row">
          <ul className="sprites-list">
            <li>
              <button
                type="button"
                className="sprite-link"
                popovertarget="sprite-front"
              >
                <img
                  src="/data/sprites/heartgold-soulsilver/front_default/pikachu.png"
                  alt="Pikachu front sprite"
                  className="sprite-img"
                />
              </button>

              <img
                popover="auto"
                id="sprite-front"
                className="sprite-popover"
                src="/data/sprites/heartgold-soulsilver/front_default/pikachu.png"
                alt="Pikachu front sprite, enlarged"
              />
            </li>

            <li>
              <button
                type="button"
                className="sprite-link"
                popovertarget="sprite-back"
              >
                <img
                  src="/data/sprites/heartgold-soulsilver/back_default/pikachu.png"
                  alt="Pikachu back sprite"
                  className="sprite-img"
                />
              </button>

              <img
                popover="auto"
                id="sprite-back"
                className="sprite-popover"
                src="/data/sprites/heartgold-soulsilver/back_default/pikachu.png"
                alt="Pikachu back sprite, enlarged"
              />
            </li>

            <li>
              <button
                type="button"
                className="sprite-link"
                popovertarget="sprite-shiny-front"
              >
                <img
                  src="/data/sprites/heartgold-soulsilver/front_shiny/pikachu.png"
                  alt="Pikachu shiny front sprite"
                  className="sprite-img"
                />
              </button>

              <img
                popover="auto"
                id="sprite-shiny-front"
                className="sprite-popover"
                src="/data/sprites/heartgold-soulsilver/front_shiny/pikachu.png"
                alt="Pikachu shiny front sprite, enlarged"
              />
            </li>

            <li>
              <button
                type="button"
                className="sprite-link"
                popovertarget="sprite-shiny-back"
              >
                <img
                  src="/data/sprites/heartgold-soulsilver/back_shiny/pikachu.png"
                  alt="Pikachu shiny back sprite"
                  className="sprite-img"
                />
              </button>

              <img
                popover="auto"
                id="sprite-shiny-back"
                className="sprite-popover"
                src="/data/sprites/heartgold-soulsilver/back_shiny/pikachu.png"
                alt="Pikachu shiny back sprite, enlarged"
              />
            </li>
          </ul>

          <button type="button" className="play-sound">
            ▶ Play Cry
          </button>

          <input
            type="range"
            className="cry-slider"
            min="0"
            max="100"
            defaultValue="0"
            aria-label="Cry progress"
            disabled
          />
        </div>
      </section>
    </div>
  );
}

export default DetailPage;