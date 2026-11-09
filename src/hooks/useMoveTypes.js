import { useCallback, useEffect, useState } from "react";

const moveTypeCache = new Map();

function fetchMoveType(url) {
   if (!moveTypeCache.has(url)) {
      const promise = fetch(url)
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Failed to load ${url}: ${response.status}`);
            }
            return response.json();
         })
         .then((move) => move.type.name)
         .catch((error) => {
            moveTypeCache.delete(url);
            throw error;
         });
      moveTypeCache.set(url, promise);
   }
   return moveTypeCache.get(url);
}

export function useMoveTypes(moves) {
   const [moveTypes, setMoveTypes] = useState({});
   const [status, setStatus] = useState("loading");
   const [attempt, setAttempt] = useState(0);

   const retry = useCallback(() => setAttempt((n) => n + 1), []);

   useEffect(() => {
      if (!moves) return;
      let cancelled = false;
      setMoveTypes({});
      setStatus("loading");

      Promise.allSettled(
         moves.map(({ move }) =>
            fetchMoveType(move.url).then((type) => [move.name, type]),
         ),
      ).then((results) => {
         if (cancelled) return;
         const entries = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);
         setMoveTypes(Object.fromEntries(entries));
         setStatus(entries.length < results.length ? "error" : "ok");
      });

      return () => {
         cancelled = true;
      };
   }, [moves, attempt]);

   return { moveTypes, status, retry };
}