import { Composition as Component } from "@/remotion/composition";

import { Composition } from "remotion";
import { z } from "zod";

import {
  COMP_NAME,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/types/constants";

const schema = z.object({
  participants: z.array(
    z.object({
      department: z.string().optional().nullable(),
      name: z.string(),
    }),
  ),
  author: z.string(),
});

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
        participants: [],
        author: "",
      }}
    />
  );
};
