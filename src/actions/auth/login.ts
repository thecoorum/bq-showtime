"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { LoginFormSchema } from "@/app/login/page";

export const login = async (data: LoginFormSchema) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    options: { shouldCreateUser: false },
  });

  if (error) {
    console.log("error");
    throw new Error(error.message);
  }

  return redirect(
    "/login/confirm?" +
      [
        data.email && `email=${data.email}`,
        data.redirectUrl && `redirect-url=${data.redirectUrl}`,
      ]
        .filter(Boolean)
        .join("&"),
  );
};
