import { getSession } from "@/actions/sessions";

export const useSession = (id: string) => ({
  queryKey: ["session", id],
  queryFn: () => getSession(id),
});
