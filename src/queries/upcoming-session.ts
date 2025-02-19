import { getUpcomingSession } from "@/actions/sessions";

export const useUpcomingSession = () => ({
  queryKey: ["upcoming-session"],
  queryFn: getUpcomingSession,
});
