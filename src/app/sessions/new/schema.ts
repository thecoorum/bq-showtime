import { z } from "zod";

export const schema = z.object({
  participants: z.array(z.string()).min(1),
});

export type NewSessionFormSchema = z.infer<typeof schema>;
