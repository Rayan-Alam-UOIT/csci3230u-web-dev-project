import { useEffect, useState } from "react";

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

   useEffect(() => {
      if (!moves) return;
      let cancelled = false;
      setMoveTypes({});

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
      });

      return () => {
         cancelled = true;
      };
   }, [moves]);

   return moveTypes;
}