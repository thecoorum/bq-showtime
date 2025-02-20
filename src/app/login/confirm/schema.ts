import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  token: z
    .string()
    .min(6, { message: "One-time password should be 6 symbols" })
    .max(6, { message: "One-time password should be 6 symbols" }),
  redirectUrl: z.string(),
});

export type LoginConfirmFormSchema = z.infer<typeof schema>;
