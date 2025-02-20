import { Text } from "@/remotion/components/text";

import {
  AbsoluteFill,
  OffthreadVideo,
  Audio,
  staticFile,
} from "remotion";

import {
  VIDEO_FPS,
} from "@/types/constants";

import type { CompositionSchema } from "@/remotion/schema"

export const Composition = ({ participants, author }: CompositionSchema) => {
  return (
    <AbsoluteFill className="flex justify-center items-center bg-black">
      <OffthreadVideo src={staticFile("st-intro.mp4")} />
      <Audio src={staticFile("intro-audio.mp3")} />
      <AbsoluteFill className="flex justify-center items-center">
        <div className="absolute">
          <Text
            name="Saladdays Production"
            config={{ in: 15, duration: 3 * VIDEO_FPS }}
          />
        </div>
        {participants.map(({ name, department }, index) => {
          const START_FRAME = 150;
          const END_FRAME = 1050;
          const TOTAL_FRAMES = END_FRAME - START_FRAME;

          const spacing = TOTAL_FRAMES / (participants.length + 1);
          const start = START_FRAME + spacing * (index + 1);
          const duration = 5 * VIDEO_FPS;

          return (
            <div key={index} className="absolute">
              <Text
                name={name}
                department={department}
                config={{ in: start, duration }}
              />
            </div>
          );
        })}
        <div className="absolute">
          <Text
            name="Yaroslav Vovchenko"
            department="Visual Effects & Animation"
            config={{
              in: 1415,
              duration: 3 * VIDEO_FPS,
            }}
          />
        </div>
        <div className="absolute">
          <Text
            name={author}
            department="Directed By"
            config={{
              in: 1520,
              duration: 3 * VIDEO_FPS,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
