"use client";

import { LoadingButton } from "@/components/button-with-loading";
import { Form } from "@/components/ui/form";
import { UsersList } from "@/app/users-list";
import { Participants } from "@/components/participants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { zodResolver } from "@hookform/resolvers/zod";
import { format, isFriday } from "date-fns";
import { tz } from "@date-fns/tz";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUpcomingSession } from "@/queries/upcoming-session";
import { useMutation } from "@tanstack/react-query";
import { useUpdate } from "@/mutations/session/update";
import { useRouter } from "next/navigation";

import { cn, getUpcomingFriday } from "@/lib/utils";

import { schema, type UpcomingSessionFormSchema } from "@/app/schema";

export const SessionForm = () => {
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
        <div className="flex flex-col gap-6 max-w-[400px] w-full max-h-[90svh] h-full">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-bold">Upcoming session</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground/60 text-sm underline cursor-pointer">
                    This session is scheduled for {isFriday(new Date()) ? "today" : "the Friday"} at 13:30 UTC.
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-background/60">
                        Formatted value (UTC):
                      </span>
                      <span className="text-xs text-background">
                        {format(getUpcomingFriday(), "d MMMM yyyy HH:mm:ss", {
                          in: tz("UTC"),
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-background/60">
                        Formatted value (
                        {Intl.DateTimeFormat().resolvedOptions().timeZone}):
                      </span>
                      <span className="text-xs text-background">
                        {format(getUpcomingFriday(), "d MMMM yyyy HH:mm:ss")}
                      </span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-col gap-2">
            <p>Session participants</p>
            <UsersList />
          </div>
          <div
            className={cn(
              "flex flex-col flex-1 rounded-lg relative border bg-background overflow-y-auto p-2 gap-2",
              !participants.length && "justify-center items-center",
            )}
          >
            {!participants.length && (
              <p className="text-center text-muted-foreground/60">
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
