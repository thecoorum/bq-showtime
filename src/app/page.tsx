"use client";

import { useRef } from "react";

import { Player, type PlayerRef } from "@remotion/player";
import { Play } from "lucide-react";

import { usePlayer } from "@/hooks/use-player";

import { Component as Composition } from "@/remotion/root";

import { DURATION_IN_FRAMES } from "@/types/constants";

const Home = () => {
  const playerRef = useRef<PlayerRef>(null);

  const { isPlaying } = usePlayer(playerRef);

  const handlePlay = () => {
    playerRef.current?.play();
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100svh] relative bg-black">
      <Player
        ref={playerRef}
        component={Composition}
        compositionWidth={1920}
        compositionHeight={1080}
        className="!w-full !h-auto aspect-video"
        durationInFrames={DURATION_IN_FRAMES}
        fps={30}
        inputProps={{
          participants: [
            {
              department: "Marketing",
              name: "Nathan Crossley",
            },
            {
              department: "Engineering",
              name: "Yaroslav Vovchenko",
            },
            {
              department: "Engineering",
              name: "Filip Defar",
            },
          ],
          author: "Johan van Zonneveld",
        }}
        clickToPlay
        doubleClickToFullscreen
        acknowledgeRemotionLicense
      />
      {!isPlaying && (
        <Play
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer text-white size-8"
          onClick={handlePlay}
        />
      )}
    </div>
  );
};

export default Home;
