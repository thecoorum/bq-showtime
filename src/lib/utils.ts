import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, startOfWeek, setHours, setMinutes } from "date-fns";

/**
 * Get the nearest Friday from a given date and set the time to 14:30 UTC.
 * @param date - The input date.
 * @returns The nearest Friday date with time set to 14:30 UTC.
 */
export const getUpcomingFriday = (date: Date): string => {
  // Start of the week (Sunday)
  const start = startOfWeek(date, { weekStartsOn: 0 });

  // Calculate the number of days to add to get to Friday
  const daysToAdd = (5 - start.getDay() + 7) % 7; // 5 is Friday
  const nearestFriday = addDays(start, daysToAdd);

  // If the input date is after the nearest Friday, get the next Friday
  const finalFriday =
    nearestFriday < date ? addDays(nearestFriday, 7) : nearestFriday;

  // Set the time to 14:30 UTC
  const fridayWithTime = setHours(setMinutes(finalFriday, 30), 14);

  return fridayWithTime.toISOString();
};

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
