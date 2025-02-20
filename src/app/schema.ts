import { z } from "zod";

export const schema = z.object({
  participants: z.array(z.string()).min(1),
});

export type UpcomingSessionFormSchema = z.infer<typeof schema>;
