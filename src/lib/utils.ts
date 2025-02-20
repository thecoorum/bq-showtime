import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
/**
 * Get the nearest Friday from a given date and set the time to 14:30 UTC.
 * @param date - The input date.
 * @returns The nearest Friday date with time set to 14:30 UTC.
 */
export const getUpcomingFriday = (date: Date): string => {
  // Convert input to UTC date
  const inputUtc = new Date(date.getTime());

  // Get the day of week in UTC (0 = Sunday, 6 = Saturday)
  const dayOfWeek = inputUtc.getUTCDay();

  // Calculate days to add to get to Friday (5 = Friday)
  let daysToAdd = (5 - dayOfWeek) % 7;
  if (daysToAdd <= 0) daysToAdd += 7; // If today is Friday or after, get next Friday

  // If it's Friday and before 14:30 UTC, use today
  if (
    dayOfWeek === 5 &&
    (inputUtc.getUTCHours() < 14 ||
      (inputUtc.getUTCHours() === 14 && inputUtc.getUTCMinutes() < 30))
  ) {
    daysToAdd = 0;
  }

  // Create the target Friday
  const fridayDate = new Date(
    Date.UTC(
      inputUtc.getUTCFullYear(),
      inputUtc.getUTCMonth(),
      inputUtc.getUTCDate() + daysToAdd,
      14, // Set hour to 14 UTC
      30, // Set minutes to 30
      0, // Set seconds to 0
      0, // Set milliseconds to 0
    ),
  );

  return fridayDate.toISOString();
};

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
