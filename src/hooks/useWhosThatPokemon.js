// AI-assisted - see AI-USAGE.md #<3>

import { useState } from "react";
import { SILHOUETTE_DISTRACTOR_COUNT, SILHOUETTE_BEST_SCORE_KEY } from "../constants/gameConstants";
import { normalize, capitalize, chooseRandomPokemon, shuffle } from "../utils/pokemonUtils";

export function useWhosThatPokemon() {
   const [rounds, setRounds] = useState([]);
   const [started, setStarted] = useState(false);
   const [finished, setFinished] = useState(false);
   const [roundIndex, setRoundIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [selected, setSelected] = useState("");
   const [revealed, setRevealed] = useState(false);
   const [bestScore, setBestScore] = useState(() => {
      const saved = Number(localStorage.getItem(SILHOUETTE_BEST_SCORE_KEY));
      return Number.isFinite(saved) && saved >= 0 ? saved : 0;
   });

   const currentRound = rounds[roundIndex];
   const isCorrect =
      revealed && normalize(selected) === normalize(currentRound?.name ?? "");

   function start(newRounds) {
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
      if (!started || finished || revealed || !selected) return;

      const correct = normalize(selected) === normalize(currentRound.name);
      if (correct) setScore((s) => s + 1);
      setRevealed(true);
   }

   function nextRound() {
      if (!revealed) return;

      if (roundIndex === rounds.length - 1) {
         setFinished(true);
         if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem(SILHOUETTE_BEST_SCORE_KEY, String(score));
         }
         return;
      }

      setRoundIndex((i) => i + 1);
      setSelected("");
      setRevealed(false);
   }

   return {
      started,
      finished,
      score,
      bestScore,
      selected,
      revealed,
      isCorrect,
      currentRound,
      roundIndex,
      roundCount: rounds.length,
      maxScore: rounds.length,
      start,
      select,
      submit,
      nextRound,
   };
}

export function createSilhouetteRounds(pokemonList, count) {
   const picks = chooseRandomPokemon(pokemonList, count);

   return picks.map((pokemon) => {
      const distractors = chooseRandomPokemon(
            pokemonList.filter((p) => p.name !== pokemon.name),
            SILHOUETTE_DISTRACTOR_COUNT,
      );

      return {
            name: capitalize(pokemon.name),
            image: pokemon.artwork.default,
            options: shuffle([pokemon, ...distractors]).map((p) =>
               capitalize(p.name),
            ),
      };
   });
}