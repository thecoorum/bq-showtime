import { useEffect, useState, type RefObject } from "react";
import type { PlayerRef, CallbackListener } from "@remotion/player";

export const usePlayer = (ref: RefObject<PlayerRef | null>) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const checkRefAvailability = () => {
      if (ref.current) {
        const onPlay: CallbackListener<"play"> = () => {
          setIsPlaying(true);
          ref.current?.requestFullscreen();
        };

        const onPause: CallbackListener<"pause"> = () => {
          setIsPlaying(false);
          ref.current?.exitFullscreen();
        };

        ref.current.addEventListener("play", onPlay);
        ref.current.addEventListener("pause", onPause);

        // Cleanup function to remove event listeners
        return () => {
          ref.current?.removeEventListener("play", onPlay);
          ref.current?.removeEventListener("pause", onPause);
        };
      }

      return null;
    };

    const intervalId = setInterval(() => {
      const cleanup = checkRefAvailability();

      if (cleanup) {
        clearInterval(intervalId);
      }
    }, 500);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [ref]);

  return { isPlaying };
};
