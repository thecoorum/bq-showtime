import { RefObject, useEffect, useState } from "react";

import type { PlayerRef, CallbackListener } from "@remotion/player";

export const usePlayer = (ref: RefObject<PlayerRef | null>) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

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

    return () => {
      if (!ref.current) return;

      ref.current.removeEventListener("play", onPlay);
      ref.current.removeEventListener("pause", onPause);
    };
  }, []);

  return { isPlaying };
};
