"use client";

import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Trash,
  ArrowUp,
  ArrowDown,
  UserMinus,
} from "lucide-react";
import { toast } from "sonner";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/queries/users";

import { cn } from "@/lib/utils";

import type { UpcomingSessionFormSchema } from "@/app/schema";

const Participant = ({ id, index }: { id: string; index: number }) => {
  const usersQuery = useQuery(useUsers());

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const form = useFormContext<UpcomingSessionFormSchema>();

  const participants = form.watch("participants");

  const user = usersQuery.data?.find((user) => user.id === id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isMovable = index !== 0 || index !== participants.length - 1;

  const handleMove = (direction: "up" | "down") => {
    const nextIndex = index + (direction === "up" ? -1 : 1);
    const Icon = direction === "up" ? ArrowUp : ArrowDown;

    form.setValue("participants", arrayMove(participants, index, nextIndex), {
      shouldDirty: true,
      shouldValidate: true,
    });

    toast("Participant moved", {
      description: `${user?.name} was moved ${direction} in the queue for the upcoming session.`,
      className: "font-[family-name:var(--font-roboto-mono)]",
      classNames: {
        title: "text-sm font-bold",
      },
      icon: <Icon className="size-4 text-black mr-2" />,
    });
  };

  const handleDelete = () => {
    form.setValue(
      "participants",
      participants.filter((participant) => participant !== id),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    toast("Participant removed", {
      description: `${user?.name} was removed from the upcoming session.`,
      className: "font-[family-name:var(--font-roboto-mono)]",
      classNames: {
        title: "text-sm font-bold",
      },
      icon: <UserMinus className="size-4 text-black mr-2" />,
    });
  };

  if (!user) return null;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        ref={setNodeRef}
        style={style}
        className={cn(isDragging && "shadow-xl z-50")}
        {...attributes}
      >
        <div
          key={user.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-black"
        >
          <div className="flex flex-col">
            {user.department && (
              <span className="text-xs uppercase">{user.department.name}</span>
            )}
            <p>{user.name}</p>
          </div>
          <Button
            ref={setActivatorNodeRef}
            size="icon"
            variant="ghost"
            className={cn("cursor-grab", isDragging && "cursor-grabbing")}
            {...listeners}
          >
            <GripVertical className="size-4 opacity-60" />
          </Button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {isMovable && (
          <>
            {index !== 0 && (
              <ContextMenuItem onClick={() => handleMove("up")}>
                <span className="flex items-center gap-2">
                  <ArrowUp className="size-4" />
                  Move Up
                </span>
              </ContextMenuItem>
            )}
            {index !== participants.length - 1 && (
              <ContextMenuItem onClick={() => handleMove("down")}>
                <span className="flex items-center gap-2">
                  <ArrowDown className="size-4" />
                  Move Down
                </span>
              </ContextMenuItem>
            )}
            <div className="h-px bg-border -mx-1 my-1"></div>
          </>
        )}
        <ContextMenuItem onClick={handleDelete}>
          <span className="flex items-center gap-2 text-destructive">
            <Trash className="size-4" />
            Remove
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const Participants = () => {
  const form = useFormContext<UpcomingSessionFormSchema>();

  const participants = form.watch("participants");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDrag = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = participants.indexOf(String(active.id));
      const newIndex = participants.indexOf(String(over.id));

      form.setValue(
        "participants",
        arrayMove(participants, oldIndex, newIndex),
        { shouldValidate: true, shouldDirty: true },
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDrag}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={participants}
        strategy={verticalListSortingStrategy}
      >
        {participants.map((id, index) => (
          <Participant key={id} id={id} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
