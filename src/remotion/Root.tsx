import {
  AbsoluteFill,
  Composition,
  OffthreadVideo,
  Audio,
  staticFile,
} from "remotion";
import { z } from "zod";

import {
  COMP_NAME,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { Text } from "./components/text";

const schema = z.object({
  participants: z.array(
    z.object({
      department: z.string().optional(),
      name: z.string(),
    }),
  ),
  author: z.string(),
});

export const Component = ({ participants, author }: z.infer<typeof schema>) => {
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

export const Root = () => {
  return (
    <Composition
      id={COMP_NAME}
      component={Component}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      schema={schema}
      defaultProps={{
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
    />
  );
};
