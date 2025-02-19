import { getSession } from "@/actions/sessions";

export const useSession = (id: string) => ({
  queryKey: ["sessions", id],
  queryFn: () => getSession(id),
});
