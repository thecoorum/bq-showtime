import { updateSession } from "@/actions/sessions";

import { toast } from "sonner";
import { CircleX } from "lucide-react";

import { useRouter } from "next/navigation";

import type { UpcomingSessionFormSchema } from "@/app/home";

export const useUpdate = (id: string) => {
  const router = useRouter();

  return {
    mutationFn: async (data: UpcomingSessionFormSchema) => {
      updateSession(id, data);
    },
    onSuccess: () => {
      router.push(`/sessions/${id}`);
    },
    onError: (error: unknown) => {
      toast.error("Session update failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong...",
        className: "font-[family-name:var(--font-roboto-mono)]",
        classNames: {
          title: "text-sm font-bold",
        },
        icon: <CircleX className="size-4 text-black mr-2" />,
      });
    },
  };
};
