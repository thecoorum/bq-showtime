import { createSession } from "@/actions/sessions";

import { toast } from "sonner";
import { CircleX } from "lucide-react";

import { useRouter } from "next/navigation";

import type { NewSessionFormSchema } from "@/app/sessions/new/schema";
import type { CreateSessionResponse } from "@/actions/sessions";

export const useCreate = () => {
  const router = useRouter();

  return {
    mutationFn: async (data: NewSessionFormSchema) => {
      return createSession(data);
    },
    onSuccess: (data: CreateSessionResponse) => {
      router.push(`/sessions/${data.id}`);
    },
    onError: (error: unknown) => {
      toast.error("Session creation failed", {
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
