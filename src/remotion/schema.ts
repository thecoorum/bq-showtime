import { z } from "zod";

export const schema = z.object({
  participants: z.array(
    z.object({
      department: z.string().optional().nullable(),
      name: z.string(),
    }),
  ),
  author: z.string(),
});

export type CompositionSchema = z.infer<typeof schema>;
