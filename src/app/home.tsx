"use client";

import { LoadingButton } from "@/components/button-with-loading";
import { Form } from "@/components/ui/form";
import { UsersList } from "@/app/users-list";
import { Participants } from "@/components/participants";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUpcomingSession } from "@/queries/upcoming-session";
import { useMutation } from "@tanstack/react-query";
import { useUpdate } from "@/mutations/session/update";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

const schema = z.object({
  participants: z.array(z.string()).min(1),
});

export type UpcomingSessionFormSchema = z.infer<typeof schema>;

export const HomePage = () => {
  const upcomingSessionQuery = useQuery(useUpcomingSession());

  const form = useForm<UpcomingSessionFormSchema>({
    defaultValues: {
      participants:
        upcomingSessionQuery.data?.participants.map(
          (participant) => participant.user_id,
        ) || [],
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation(useUpdate(upcomingSessionQuery.data?.id || ""));

  const router = useRouter();

  const participants = form.watch("participants");

  const handleFormSubmit = (data: UpcomingSessionFormSchema) => {
    mutation.mutate(data);
  };

  const handleProceed = () => {
    if (form.formState.isDirty) {
      form.handleSubmit(handleFormSubmit)();
    } else {
      router.push(`/sessions/${upcomingSessionQuery.data?.id}`);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col gap-6 max-w-[400px] w-full">
          <h2 className="text-4xl font-bold">Upcoming session</h2>
          <div className="flex flex-col gap-2">
            <p>Session participants</p>
            <UsersList />
          </div>
          <div
            className={cn(
              "flex flex-col h-[60svh] rounded-lg border bg-background overflow-y-auto p-2 gap-2",
              !participants.length && "justify-center items-center",
            )}
          >
            {!participants.length && (
              <p className="text-center text-muted-foreground/60">
                No participants yet. You can add them from the menu above.
              </p>
            )}
            <Participants />
          </div>
          <LoadingButton
            size="lg"
            className="w-full"
            disabled={!form.formState.isValid}
            onClick={handleProceed}
            loading={mutation.isPending}
          >
            {form.formState.isValid && (
              <>
                {form.formState.isDirty && <>Update session and proceed</>}
                {!form.formState.isDirty && <>Proceed</>}
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
