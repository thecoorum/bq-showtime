import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatISO, isFriday, nextFriday, set } from "date-fns";
import { UTCDate } from "@date-fns/utc";

/**
 * Get the nearest Friday from a given date and set the time to 14:30 UTC.
 * @param date - The input date.
 * @returns The nearest Friday date with time set to 14:30 UTC.
 */
export const getUpcomingFriday = (): string => {
  const date = new UTCDate();

  if (isFriday(date)) {
    return formatISO(
      set(new UTCDate(), { hours: 13, minutes: 30, seconds: 0 }),
    );
  }

  return formatISO(
    set(nextFriday(new UTCDate()), { hours: 13, minutes: 30, seconds: 0 }),
  );
};

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
