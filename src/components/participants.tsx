"use client";

import { Button } from "@/components/ui/button";

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
import { GripVertical } from "lucide-react";

import { useFormContext } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUsers } from "@/queries/users";

import { cn } from "@/lib/utils";

import type { UpcomingSessionFormSchema } from "@/app/home";

const Participant = ({ id }: { id: string }) => {
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

  const user = usersQuery.data?.find((user) => user.id === id);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!user) return null;

  return (
    <div
      key={user.id}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg border bg-black",
        isDragging && "shadow-xl z-50",
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
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
        {participants.map((id) => (
          <Participant key={id} id={id} />
        ))}
      </SortableContext>
    </DndContext>
  );
};
