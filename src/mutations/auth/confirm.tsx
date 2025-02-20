import { confirm } from "@/actions/auth/confirm";

import { toast } from "sonner";
import { CircleX } from "lucide-react";

import type { LoginConfirmFormSchema } from "@/app/login/confirm/schema";

export const useConfirm = () => {
  return {
    mutationFn: async (data: LoginConfirmFormSchema) => {
      await confirm(data);
    },
    onError: (error: unknown) => {
      // Prevent showing the toast if the user is redirected
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;

      toast.error("Login confirmation failed", {
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
