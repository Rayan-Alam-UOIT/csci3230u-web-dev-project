// AI-assisted - see AI-USAGE.md #<3>

import { useMemo, useState } from "react";
import { MAX_SUGGESTIONS } from "../constants/gameConstants";
import { normalize } from "../utils/pokemonUtils";

export function useGuessAutocomplete({ allNames, guesses, disabled, onSubmit }) {
   const [guess, setGuess] = useState("");
   const [activeIndex, setActiveIndex] = useState(-1);
   const [showSuggestions, setShowSuggestions] = useState(false);

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
   const listOpen = showSuggestions && suggestions.length > 0 && !disabled;

   function reset() {
      setGuess("");
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function handleChange(value) {
      setGuess(value);
      setActiveIndex(-1);
      setShowSuggestions(true);
   }

   function hideSuggestions() {
      setShowSuggestions(false);
   }

   function chooseSuggestion(name) {
      setGuess(name);
      setActiveIndex(-1);
      setShowSuggestions(false);
   }

   function handleKeyDown(event) {
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

   function handleSubmit(event) {
      event.preventDefault();

      if (listOpen && activeIndex >= 0) {
         chooseSuggestion(suggestions[activeIndex]);
         return;
      }

      if (!canGuess || disabled) return;
      const text = matchedName ?? guess.trim();

      onSubmit(text);
      reset();
   }

   return {
      guess,
      suggestions,
      activeIndex,
      canGuess,
      listOpen,
      reset,
      handleChange,
      hideSuggestions,
      chooseSuggestion,
      handleKeyDown,
      handleSubmit,
   };
}