
import { Link } from "react-router-dom";
import { titleCase } from "../utils/pokemonUtils";
import { useEvolutionChain } from "../hooks/useEvolutionChain";

function getEvolutionMethod(details) {
  const detail = details?.[0];

  if (!detail) return null;

  if (detail.min_level) return `Level ${detail.min_level}`;

  if (detail.item) return `Use ${titleCase(detail.item.name)}`;

  if (detail.min_happiness) return "High friendship";

  if (detail.trigger?.name === "trade") return "Trade";

  return titleCase(detail.trigger?.name ?? "Special condition");
}

function EvolutionChain({ speciesId }) {
  const { evolutions, status } = useEvolutionChain(speciesId);

  return (
    <section className="evolution-section" aria-labelledby="evolution-heading">
      <h2 id="evolution-heading" className="detail-type">
        EVOLUTION CHAIN
      </h2>

      {status === "loading" && (
        <p role="status">Loading evolutions…</p>
      )}

      {status === "error" && (
        <p role="alert">Unable to load evolutions.</p>
      )}

      {status === "ok" && (
        <div className="evolution-list">
          {evolutions.map((evolution, index) => (
            <div className="evolution-step" key={evolution.name}>
              {index > 0 && (
                <div className="evolution-method">
                  <span aria-hidden="true">→</span>
                  <small>
                    {getEvolutionMethod(evolution.evolutionDetails)}
                  </small>
                </div>
              )}

              <Link
                to={`/pokemon/${evolution.id}`}
                className="evolution-card"
                aria-label={`View ${titleCase(evolution.name)} details`}
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`}
                  alt=""
                  loading="lazy"
                />

                <strong>{titleCase(evolution.name)}</strong>
                <small>#{String(evolution.id).padStart(3, "0")}</small>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EvolutionChain;