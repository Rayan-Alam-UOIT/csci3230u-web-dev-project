// AI-assisted - see AI-USAGE.md #<4>

import { useCallback, useEffect, useRef, useState } from "react";

export function useCry(cryPath) {
   const audioRef = useRef(null);
   const fillRef = useRef(null);
   const rafRef = useRef(null);
   const [isPlaying, setIsPlaying] = useState(false);

   useEffect(() => {
      if (!cryPath) {
         return;
      }

      let stopped = false;

      const audio = new Audio(cryPath);
      audio.preload = "auto";
      audioRef.current = audio;

      function tick() {
         if (stopped) {
            return;
         }
         if (audio.duration && fillRef.current) {
            fillRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
         }
         if (!audio.paused && !audio.ended) {
            rafRef.current = requestAnimationFrame(tick);
         }
      }

      function onPlaying() {
         if (stopped) {
            return;
         }
         setIsPlaying(true);
         tick();
      }

      function onEnded() {
         if (stopped) {
            return;
         }
         cancelAnimationFrame(rafRef.current);
         if (fillRef.current) {
            fillRef.current.style.width = "100%";
         }
         setIsPlaying(false);

         setTimeout(() => {
            if (fillRef.current && audio.ended) {
               fillRef.current.style.width = "0%";
            }
         }, 250);
      }

      audio.addEventListener("playing", onPlaying);
      audio.addEventListener("ended", onEnded);

      return () => {
         stopped = true;
         cancelAnimationFrame(rafRef.current);
         audio.pause();
         audio.removeEventListener("playing", onPlaying);
         audio.removeEventListener("ended", onEnded);
         if (fillRef.current) {
            fillRef.current.style.width = "0%";
         }
         setIsPlaying(false);
      };
   }, [cryPath]);
   
   const play = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) {
         return;
      }

      cancelAnimationFrame(rafRef.current);
      if (fillRef.current) {
         fillRef.current.style.width = "0%";
      }
      setIsPlaying(false);

      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(() => {});
   }, []);

   return { play, isPlaying, fillRef };
}