"use client";

import { useEffect } from "react";

import NumberFlow, { NumberFlowGroup } from "@number-flow/react";

import { useCountdown } from "usehooks-ts";

export const Countdown = ({
  value,
  onFinish,
}: {
  value: number;
  onFinish: () => void;
}) => {
  const [count, { startCountdown }] = useCountdown({
    countStart: value,
  });

  useEffect(() => {
    startCountdown();
  }, []);

  useEffect(() => {
    if (count > 0) return;

    onFinish();
  }, [count, onFinish]);

  const hh = Math.floor(count / 3600);
  const mm = Math.floor((count % 3600) / 60);
  const ss = count % 60;

  return (
    <div className="flex flex-col gap-2 justify-center items-center h-full bg-black">
      <div className="flex flex-col">
        <h2 className="text-lg text-white font-medium">
          This session will start in
        </h2>
        <NumberFlowGroup>
          <div
            style={{
              fontVariantNumeric: "tabular-nums",
            }}
            className="text-4xl flex items-baseline font-semibold"
          >
            <NumberFlow
              trend={-1}
              value={hh}
              format={{ minimumIntegerDigits: 2 }}
              suffix="H"
            />
            <NumberFlow
              prefix=":"
              trend={-1}
              value={mm}
              digits={{ 1: { max: 5 } }}
              format={{ minimumIntegerDigits: 2 }}
              suffix="M"
            />
            <NumberFlow
              prefix=":"
              trend={-1}
              value={ss}
              digits={{ 1: { max: 5 } }}
              format={{ minimumIntegerDigits: 2 }}
              suffix="S"
            />
          </div>
        </NumberFlowGroup>
      </div>
    </div>
  );
};
