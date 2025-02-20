"use client";

import { useMemo, useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Check, Plus, UserMinus, UserPlus } from "lucide-react";
import { group } from "radash";
import { toast } from "sonner";

import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/queries/users";
import { useFormContext } from "react-hook-form";

import type { UpcomingSessionFormSchema } from "@/app/schema";

export const UsersList = ({
  onCreateClick,
}: {
  onCreateClick?: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const usersQuery = useQuery(useUsers());

  const form = useFormContext<UpcomingSessionFormSchema>();

  const participants = form.watch("participants");
  const usersByDepartment = useMemo(() => {
    if (!usersQuery.data) return [];

    return group(
      usersQuery.data,
      (user) => user.department?.name || "No department",
    );
  }, [usersQuery.data]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="lg"
            aria-expanded={open}
            className="cursor-pointer w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span className="truncate">Add or create participant</span>
            <kbd className="inline-flex h-5 max-h-full items-center font-[inherit] text-xs font-medium text-muted-foreground/70">
              ⌘K
            </kbd>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command loop>
            <CommandInput placeholder="Find employee" />
            <CommandList>
              <CommandEmpty>No employees found.</CommandEmpty>
              {Object.entries(usersByDepartment).map(([department, users]) => (
                <CommandGroup key={department} heading={department}>
                  {(users || []).map((user) => {
                    const toggle = () => {
                      if (participants.includes(user.id)) {
                        form.setValue(
                          "participants",
                          participants.filter((id) => id !== user.id),
                          { shouldValidate: true, shouldDirty: true },
                        );

                        toast("Participant removed", {
                          description: `${user.name} was removed from the upcoming session.`,
                          className:
                            "font-[family-name:var(--font-roboto-mono)]",
                          classNames: {
                            title: "text-sm font-bold",
                          },
                          icon: (
                            <UserMinus className="size-4 text-black mr-2" />
                          ),
                        });
                      } else {
                        form.setValue(
                          "participants",
                          [...participants, user.id],
                          { shouldValidate: true, shouldDirty: true },
                        );

                        toast("Participant added", {
                          description: `${user.name} was added to the upcoming session.`,
                          className:
                            "font-[family-name:var(--font-roboto-mono)]",
                          classNames: {
                            title: "text-sm font-bold",
                          },
                          icon: <UserPlus className="size-4 text-black mr-2" />,
                        });
                      }
                    };

                    return (
                      <CommandItem
                        key={user.id}
                        value={user.name || user.id}
                        onSelect={toggle}
                      >
                        {user.name}
                        {participants.includes(user.id) && (
                          <Check className="size-4 ml-auto" />
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ))}
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={onCreateClick}>
                  <Plus className="size-4 opacity-60" />
                  Add employee
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <span className="text-xs text-muted-foreground">
        Hint: You can use{" "}
        <kbd className="inline-flex h-5 max-h-full items-center font-[inherit] text-xs font-medium text-muted-foreground/70">
          ⌘K
        </kbd>{" "}
        to add participants.
      </span>
    </div>
  );
};
