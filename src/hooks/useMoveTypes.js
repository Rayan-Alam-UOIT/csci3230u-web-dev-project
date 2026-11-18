// AI-assisted - see AI-USAGE.md #17

import { useCallback, useEffect, useState } from "react";

const moveTypeCache = new Map();

async function fetchMoveType(url, signal) {
   if (moveTypeCache.has(url)) return moveTypeCache.get(url);

   const response = await fetch(url, { signal });
   if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
   }
   const move = await response.json();

   moveTypeCache.set(url, move.type.name);
   return move.type.name;
}

export function useMoveTypes(moves) {
   const [attempt, setAttempt] = useState(0);
   const [result, setResult] = useState({
      moves: null,
      attempt: 0,
      moveTypes: {},
      status: "loading",
   });



   const retry = useCallback(() => setAttempt((n) => n + 1), []);

   useEffect(() => {
      if (!moves) return;
      const controller = new AbortController();
      const { signal } = controller;

      Promise.allSettled(
         moves.map(({ name, url }) =>
            fetchMoveType(url, signal).then((type) => [name, type]),
         ),
      ).then((results) => {
         if (signal.aborted) return;
         const entries = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);
         setResult({
            moves,
            attempt,
            moveTypes: Object.fromEntries(entries),
            status: entries.length < results.length ? "error" : "ok",
         });
      });

      return () => controller.abort();
   }, [moves, attempt]);

   if (!moves) {
      return { moveTypes: {}, status: "idle", retry };
   }

   if (result.moves !== moves || result.attempt !== attempt) {
      return { moveTypes: {}, status: "loading", retry };
   }

   return { moveTypes: result.moveTypes, status: result.status, retry };
}