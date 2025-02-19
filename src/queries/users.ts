import { getUsers } from "@/actions/users";

export const useUsers = () => ({
  queryKey: ["users"],
  queryFn: getUsers,
});
