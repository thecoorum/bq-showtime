"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";

import { Player, type PlayerRef } from "@remotion/player";
import { Play, Loader2 } from "lucide-react";

import { usePlayer } from "@/hooks/use-player";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/queries/session";

import { Component as Composition } from "@/remotion/root";

import { DURATION_IN_FRAMES } from "@/types/constants";

export const SessionPlayer = ({ id }: { id: string }) => {
  const playerRef = useRef<PlayerRef>(null);

  const sessionQuery = useQuery(useSession(id));

  const { isPlaying } = usePlayer(playerRef);

  const handlePlay = () => {
    playerRef.current?.play();
  };

  if (!sessionQuery.data) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-full relative bg-black">
      <Player
        ref={playerRef}
        component={Composition}
        compositionWidth={1920}
        compositionHeight={1080}
        className="!w-full !h-auto aspect-video"
        durationInFrames={DURATION_IN_FRAMES}
        fps={30}
        inputProps={{
          participants: sessionQuery.data.participants.map((participant) => ({
            name: participant.name || "Unknown",
            department: participant.department?.name,
          })),
          author: sessionQuery.data.author.name || "Mysterious Author",
        }}
        clickToPlay
        doubleClickToFullscreen
        acknowledgeRemotionLicense
      />
      {!isPlaying && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center backdrop-blur-lg">
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer"
            onClick={handlePlay}
          >
            <Play className="text-white" />
          </Button>
        </div>
      )}
    </div>
  );
};
