import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";

export const useParticipantsQuery = () => {
  return useQueryState("participants", parseAsArrayOf(parseAsString));
};
