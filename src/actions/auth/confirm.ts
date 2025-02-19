"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import type { LoginConfirmFormSchema } from "@/app/login/confirm/page";

export const confirm = async (data: LoginConfirmFormSchema) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: "email",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect(data.redirectUrl || "/");
};
