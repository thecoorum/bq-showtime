import { Input } from "@/components/ui/input";

import { AtSign } from "lucide-react";

import { cn } from "@/lib/utils";

export const EmailInput = ({
  className,
  ...props
}: React.ComponentProps<"input">) => (
  <div className="relative">
    <Input
      className={cn("peer ps-9", className)}
      placeholder="yaroslav@booqable.com"
      type="email"
      {...props}
    />
    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
      <AtSign size={16} strokeWidth={2} aria-hidden="true" />
    </div>
  </div>
);
