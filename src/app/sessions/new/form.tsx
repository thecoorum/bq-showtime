"use client";

import { LoadingButton } from "@/components/button-with-loading";
import { Form } from "@/components/ui/form";
import { UsersList } from "@/app/users-list";
import { Participants } from "@/components/participants";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useCreate } from "@/mutations/session/create";

import { cn } from "@/lib/utils";

import { schema, type NewSessionFormSchema } from "@/app/sessions/new/schema";

export const SessionForm = () => {
  const form = useForm<NewSessionFormSchema>({
    defaultValues: {
      participants: [],
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation(useCreate());

  const participants = form.watch("participants");

  const handleFormSubmit = (data: NewSessionFormSchema) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col gap-6 max-w-[400px] w-full">
          <h2 className="text-4xl font-bold">Create session</h2>
          <div className="flex flex-col gap-2">
            <p>Session participants</p>
            <UsersList />
          </div>
          <div
            className={cn(
              "flex flex-col h-[60svh] relative rounded-lg border bg-background overflow-y-auto p-2 gap-2",
              !participants.length && "justify-center items-center",
            )}
          >
            {!participants.length && (
              <p className="text-center text-muted-foreground/60 text-sm">
                No participants yet. You can add them from the menu above.
              </p>
            )}
            <Participants />
            <div className="flex justify-center items-center p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/100 to-background/30 pointer-events-none">
              <span className="text-center text-white/60 text-xs">
                Hint: You can right click on participant to reveal the context
                menu
              </span>
            </div>
          </div>
          <LoadingButton
            size="lg"
            className="w-full cursor-pointer"
            disabled={!form.formState.isValid}
            onClick={form.handleSubmit(handleFormSubmit)}
            loading={mutation.isPending}
          >
            {form.formState.isValid && (
              <>
                Proceed
              </>
            )}
            {!form.formState.isValid && (
              <>At least 1 participant is required.</>
            )}
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
};
