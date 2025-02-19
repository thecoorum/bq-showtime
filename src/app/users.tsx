"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArchiveRestore, Plus, Share2, Trash } from "lucide-react";

import { group } from "radash";

import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/queries/users";
import { useFormContext } from "react-hook-form";

import type { UpcomingSessionFormSchema } from "./home";

export const UsersMenu = ({
  onCreateClick,
}: {
  onCreateClick?: () => void;
}) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Add or create user
          <Plus
            className="-me-1 ms-2 opacity-60 size-4"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onCreateClick}>
            <Plus
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Create user</span>
            {/* <DropdownMenuShortcut>⌘N</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {Object.entries(usersByDepartment).map(([department, users]) => (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                {department}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {(users || []).map((user) => {
                    const toggle = (checked: boolean) => {
                      if (checked) {
                        form.setValue("participants", [
                          ...participants,
                          user.id,
                        ]);
                      } else {
                        form.setValue(
                          "participants",
                          participants.filter((id) => id !== user.id),
                        );
                      }
                    };

                    return (
                      <DropdownMenuCheckboxItem
                        checked={participants.includes(user.id)}
                        onCheckedChange={toggle}
                      >
                        <div className="flex flex-col">
                          <p className="text-xs uppercase">{department}</p>
                          {user.name}
                        </div>
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </>
        ))}
        {/* <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>Framework</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={framework}
                  onValueChange={setFramework}
                >
                  <DropdownMenuRadioItem value="nextjs">
                    Next.js
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="sveltekit" disabled>
                    SvelteKit
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="remix">
                    Remix
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="astro">
                    Astro
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger inset>Notifications</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                >
                  Email
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                >
                  Push
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Share2
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveRestore
              size={16}
              strokeWidth={2}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Archive</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <Trash size={16} strokeWidth={2} aria-hidden="true" />
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
