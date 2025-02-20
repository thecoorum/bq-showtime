import { z } from "zod";

export const schema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@booqable.com"), {
      message: "Only emails with the @booqable.com domain are supported",
    }),
  redirectUrl: z.string(),
});

export type LoginFormSchema = z.infer<typeof schema>;
