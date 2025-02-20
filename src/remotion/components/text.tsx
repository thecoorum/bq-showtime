import { useCurrentFrame, interpolate } from "remotion";

const TRANSITION_DURATION = 10;
const OFFSET = 5;

export const Text = ({
  name,
  department,
  config,
}: {
  name: string;
  department?: string | null;
  config: {
    in: number;
    duration: number;
  };
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [
      config.in,
      config.in + TRANSITION_DURATION,
      config.in + config.duration,
      config.in + TRANSITION_DURATION + config.duration,
    ],
    [0, 1, 1, 0],
  );
  const overlay = interpolate(
    frame,
    [
      config.in + OFFSET,
      config.in + OFFSET + TRANSITION_DURATION,
      config.in + config.duration + OFFSET,
      config.in + config.duration + OFFSET + TRANSITION_DURATION,
    ],
    [0, 1, 1, 0],
  );

  return (
    <div className="flex flex-col">
      {department && (
        <div className="relative">
          <p
            style={{ opacity: overlay }}
            className="font-itc font-normal text-[#B0AEB0] text-xl uppercase absolute top-0 left-0 cursor-default"
          >
            {department}
          </p>
          <p
            style={{ opacity }}
            className="font-itc font-normal text-[#A25247] text-xl uppercase cursor-default"
          >
            {department}
          </p>
        </div>
      )}
      <div className="relative">
        <p
          style={{ opacity: overlay }}
          className="font-itc font-bold text-[#B0AEB0] text-6xl uppercase absolute top-0 left-0 cursor-default"
        >
          {name}
        </p>
        <p
          style={{ opacity }}
          className="font-itc font-bold text-[#A25247] text-6xl uppercase cursor-default"
        >
          {name}
        </p>
      </div>
    </div>
  );
};
