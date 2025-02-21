import { login } from "@/actions/auth/login";

import { toast } from "sonner";
import { CircleX } from "lucide-react";

import type { LoginFormSchema } from "@/app/login/schema";

export const useLogin = () => {
  return {
    mutationFn: async (data: LoginFormSchema) => {
      return login(data);
    },
    onError: (error: unknown) => {
      // Prevent showing the toast if the user is redirected
      if (error instanceof Error && error.message === "NEXT_REDIRECT") return;

      toast.error("Login failed", {
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
