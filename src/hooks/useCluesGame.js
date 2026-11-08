// AI-assisted - see AI-USAGE.md #<3>

import { useState } from "react";
import { GENERATION_NUMBERS, CLUES_BEST_SCORE_KEY } from "../constants/gameConstants";
import { normalize, capitalize } from "../utils/pokemonUtils";

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

export function useCluesGame() {
   const [clueRounds, setClueRounds] = useState([]);
   const [started, setStarted] = useState(false);
   const [finished, setFinished] = useState(false);
   const [clueRoundIndex, setClueRoundIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [bestScore, setBestScore] = useState(() => {
      const savedScore = Number(localStorage.getItem(CLUES_BEST_SCORE_KEY));
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
            localStorage.setItem(CLUES_BEST_SCORE_KEY, String(score));
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

export function createCluesRounds(pokemonList) {
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