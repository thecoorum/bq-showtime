"use client";

import { useMemo, useState } from "react";

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

import { Check, ChevronDown, Plus } from "lucide-react";
import { group } from "radash";

import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/queries/users";
import { useFormContext } from "react-hook-form";

import type { UpcomingSessionFormSchema } from "@/app/home";

export const UsersList = () => {
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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
        >
          <span className="truncate">Add or create employee</span>
          <ChevronDown
            size={16}
            strokeWidth={2}
            className="shrink-0 text-muted-foreground/80"
            aria-hidden="true"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Find employee" />
          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>
            {Object.entries(usersByDepartment).map(([department, users]) => (
              <CommandGroup key={department} heading={department}>
                {(users || []).map((user) => {
                  const toggle = (value: string) => {
                    if (participants.includes(value)) {
                      form.setValue(
                        "participants",
                        participants.filter((id) => id !== user.id),
                      );
                    } else {
                      form.setValue("participants", [...participants, user.id]);
                    }
                  };

                  return (
                    <CommandItem
                      key={user.id}
                      value={user.id}
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
              <Button
                variant="ghost"
                className="w-full justify-start font-normal"
              >
                <Plus
                  size={16}
                  strokeWidth={2}
                  className="-ms-2 me-2 opacity-60"
                  aria-hidden="true"
                />
                New employee
              </Button>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
