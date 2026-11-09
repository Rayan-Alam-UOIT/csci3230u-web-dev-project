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
   const [moveTypes, setMoveTypes] = useState({});
   const [status, setStatus] = useState("loading");
   const [attempt, setAttempt] = useState(0);

   const retry = useCallback(() => setAttempt((n) => n + 1), []);

   useEffect(() => {
      if (!moves) return;
      const controller = new AbortController();
      const { signal } = controller;

      setMoveTypes({});
      setStatus("loading");

      Promise.allSettled(
         moves.map(({ move }) =>
            fetchMoveType(move.url, signal).then((type) => [move.name, type]),
         ),
      ).then((results) => {
         if (signal.aborted) return;
         const entries = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);
         setMoveTypes(Object.fromEntries(entries));
         setStatus(entries.length < results.length ? "error" : "ok");
      });

      return () => controller.abort();
   }, [moves, attempt]);

   return { moveTypes, status, retry };
}