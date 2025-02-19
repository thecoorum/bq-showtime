import { Button, type ButtonProps } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = ({
  children,
  loading,
  className,
  ...props
}: LoadingButtonProps) => (
  <Button className={cn("relative overflow-hidden", className)} {...props}>
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%_-_var(--offset-y))]"
      initial={{ "--offset-y": "-50px" }}
      animate={{
        "--offset-y": loading ? "0px" : "-50px",
      }}
    >
      <Loader2 className="size-4 animate-spin" />
    </motion.div>
    <motion.span
      initial={{ "--offset-y": "0px" }}
      animate={{
        "--offset-y": loading ? "50px" : "0px",
      }}
      className="translate-y-[var(--offset-y)] text-center"
    >
      {children}
    </motion.span>
  </Button>
);
