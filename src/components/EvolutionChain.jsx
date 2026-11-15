
import { Link } from "react-router-dom";
import { titleCase } from "../utils/pokemonUtils";
import { useEvolutionChain } from "../hooks/useEvolutionChain";
import { useMediaQuery } from "../hooks/useMediaQuery";

function getEvolutionMethod(details) {
  const detail = details?.[0];

  if (!detail) return null;

  if (detail.min_level) return `Level ${detail.min_level}`;

  if (detail.item) return `Use ${titleCase(detail.item.name)}`;

  if (detail.min_happiness) return "High Friendship";

  if (detail.trigger?.name === "trade") return "Trade";

  return titleCase(detail.trigger?.name ?? "Special Condition");
}

function EvolutionCard({ evolution }) {
  return (
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
  );
}

function chunk(items, size) {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
}

function EvolutionNode({ node, chunkSize, isRoot = false }) {
  const method = getEvolutionMethod(node.evolutionDetails);

  const groups = node.evolvesTo.length === 0 ? [[]] : chunk(node.evolvesTo, chunkSize);

  const nodes = groups.map((children, index) => (
    <div className="evolution-node" key={index}>
      <div className="evolution-step">
        {!isRoot && (
          <div className="evolution-method">
            <span aria-hidden="true">→</span>
            <small>{method}</small>
          </div>
        )}
        <EvolutionCard evolution={node} />
      </div>

      {children.length > 0 && (
        <div className="evolution-branches">
          {children.map((child) => (
            <EvolutionNode
              key={child.name}
              node={child}
              chunkSize={chunkSize}
            />
          ))}
        </div>
      )}
    </div>
  ));

  if (nodes.length === 1) return nodes[0];

  return <div className="evolution-variants">{nodes}</div>;
}

function EvolutionChain({ speciesId }) {
  const { chain, status } = useEvolutionChain(speciesId);
  const isWide = useMediaQuery("(min-width: 40em)");
  const chunkSize = isWide ? Infinity : 2;

  return (
    <section className="evolution-section" aria-labelledby="evolution-heading">
      <h2 id="evolution-heading" className="detail-type">
        EVOLUTION CHAIN
      </h2>

      {status === "loading" && <p role="status">Loading evolutions…</p>}
      {status === "error" && <p role="alert">Unable to load evolutions.</p>}

      {status === "ok" && chain && (
        <div className="evolution-list">
          <EvolutionNode node={chain} chunkSize={chunkSize} isRoot />
        </div>
      )}
    </section>
  );
}

export default EvolutionChain;