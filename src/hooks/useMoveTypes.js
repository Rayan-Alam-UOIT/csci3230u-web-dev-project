// AI-assisted - see AI-USAGE.md #<17, 22>

import { useCallback, useEffect, useMemo, useState } from "react";
import { BATCH_SIZE } from "../constants/moveTypesConstants"

const moveTypeCache = new Map();

async function fetchMoveType(url, signal) {
   if (moveTypeCache.has(url)) return moveTypeCache.get(url);

   const response = await fetch(url, { signal });

   if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status}`);
   }

   const move = await response.json();
   const type = move.type.name;

   moveTypeCache.set(url, type);
   return type;
}

export function useMoveTypes(moves) {
   const [attempt, setAttempt] = useState(0);
   const [result, setResult] = useState({
      moves: null,
      attempt: 0,
      moveTypes: {},
      status: "loading",
   });

   const knownTypes = useMemo(
      () => Object.fromEntries((moves ?? []).filter((m) => m.type).map((m) => [m.name, m.type])),
      [moves],
   );
   const pendingMoves = useMemo(() => (moves ?? []).filter((m) => !m.type), [moves]);

   const retry = useCallback(() => {
      setAttempt((n) => n + 1);
   }, []);

   useEffect(() => {
      if (!moves || pendingMoves.length === 0) return;

      const controller = new AbortController();
      const { signal } = controller;

      async function loadMoveTypes() {
         const moveTypes = {};
         let failed = false;

         for (let i = 0; i < pendingMoves.length; i += BATCH_SIZE) {
            if (signal.aborted) return;

            const batch = pendingMoves.slice(i, i + BATCH_SIZE);

            const results = await Promise.allSettled(
               batch.map(({ name, url }) =>
                  fetchMoveType(url, signal).then((type) => [name, type])
               ),
            );

            if (signal.aborted) return;

            for (const result of results) {
               if (result.status === "fulfilled") {
                  const [name, type] = result.value;
                  moveTypes[name] = type;
               } else {
                  failed = true;
                  console.error("Failed to load move type:", result.reason);
               }
            }

            setResult({
               moves,
               attempt,
               moveTypes: { ...moveTypes },
               status: "loading",
            });
         }

         setResult({
            moves,
            attempt,
            moveTypes: { ...moveTypes },
            status: failed ? "error" : "ok",
         });
      }

      loadMoveTypes();

      return () => controller.abort();
   }, [moves, pendingMoves, attempt]);

   if (!moves) {
      return { moveTypes: {}, status: "idle", retry };
   }

   if (pendingMoves.length === 0) {
      return { moveTypes: knownTypes, status: "ok", retry };
   }

   if (result.moves !== moves || result.attempt !== attempt) {
      return { moveTypes: knownTypes, status: "loading", retry };
   }

   return {
      moveTypes: { ...knownTypes, ...result.moveTypes },
      status: result.status,
      retry,
   };
}