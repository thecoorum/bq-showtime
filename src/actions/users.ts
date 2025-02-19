"use server";

import { createClient } from "@/lib/supabase/server";

import type { Tables } from "@/database.types";

export interface User extends Tables<"users"> {
  department: Tables<"departments"> | null;
}

export const getUsers = async (): Promise<User[]> => {
  const supabase = await createClient();

  const users = await supabase
    .from("users")
    .select("*, department:departments(*)");

  if (users.error) {
    throw new Error(users.error.message);
  }

  return users.data;
};
