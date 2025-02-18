import { clsx, type ClassValue } from "clsx";
import { addDays, isFriday, differenceInSeconds } from "date-fns";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const calculateSecondsToNextFriday = () => {
  const now = new Date();
  let nextFriday = new Date(now);

  // Find the next Friday
  while (!isFriday(nextFriday)) {
    nextFriday = addDays(nextFriday, 1);
  }

  // Set the time to 14:30 UTC
  const targetDate = new Date(
    Date.UTC(
      nextFriday.getUTCFullYear(),
      nextFriday.getUTCMonth(),
      nextFriday.getUTCDate(),
      14,
      30,
    ),
  );

  const differenceInSec = differenceInSeconds(targetDate, now);

  return differenceInSec > 0 ? differenceInSec : 0;
};
