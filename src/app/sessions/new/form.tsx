"use client";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { format } from "date-fns";
import { tz } from "@date-fns/tz";

import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCreate } from "@/mutations/session/create";
import { useUpcomingSession } from "@/queries/upcoming-session";
import { useQueryState } from "nuqs";
import { useParticipantsQuery } from "@/hooks/use-participants-query";

import { cn, getUpcomingFriday } from "@/lib/utils";

import { schema, type NewSessionFormSchema } from "@/app/sessions/new/schema";

const AnimatedAlert = motion.create(Alert);

export const SessionForm = () => {
  const [participantsQuery] = useParticipantsQuery();
  const [ignoreWarning, setIgnoreWarning] = useQueryState(
    "ignore-upcoming-warning",
    { history: "replace" },
  );

  const upcomingSessionQuery = useQuery(useUpcomingSession());

  const form = useForm<NewSessionFormSchema>({
    defaultValues: { participants: participantsQuery || [] },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation(useCreate());

  const participants = form.watch("participants");

  const handleFormSubmit = (data: NewSessionFormSchema) => {
    mutation.mutate(data);
  };

  const handleWarningDismiss = () => {
    setIgnoreWarning("true");
  };

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center items-center h-full">
        <motion.div className="flex flex-col gap-6 max-w-[400px] w-full max-h-[90svh] h-full">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-bold">Create session</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground/60 text-sm underline cursor-pointer">
                    This session will be scheduled for the next Friday at 13:30
                    UTC.
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
            <UsersList persist />
          </div>
          <AnimatePresence>
            {upcomingSessionQuery.data && !ignoreWarning && (
              <AnimatedAlert
                initial={{ opacity: 0, scale: 0.9, maxHeight: 0 }}
                animate={{ opacity: 1, scale: 1, maxHeight: 250 }}
                exit={{ opacity: 0, scale: 0.9, maxHeight: 0 }}
              >
                <CircleAlert />
                <AlertTitle>There is an existing upcoming session</AlertTitle>
                <AlertDescription>
                  While you are creating a new session, there is an existing one
                  that is going to start soon. If you want to edit it instead of
                  creating a new one, press the button below.
                  <div className="flex flex-col gap-2 mt-2 w-full">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/">Edit upcoming session</Link>
                    </Button>
                    <Button
                      className="w-full"
                      size="lg"
                      variant="secondary"
                      onClick={handleWarningDismiss}
                    >
                      Ignore
                    </Button>
                  </div>
                </AlertDescription>
              </AnimatedAlert>
            )}
          </AnimatePresence>
          <motion.div
            className={cn(
              "flex flex-col flex-1 relative rounded-lg border bg-background overflow-y-auto p-2 gap-2 transition-all",
              !participants.length && "justify-center items-center",
            )}
          >
            {!participants.length && (
              <p className="text-center text-muted-foreground/60 text-sm">
                No participants yet. You can add them from the menu above.
              </p>
            )}
            <Participants persist />
            <div className="flex justify-center items-center p-4 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/100 to-background/30 pointer-events-none">
              <span className="text-center text-white/60 text-xs">
                Hint: You can right click on participant to reveal the context
                menu
              </span>
            </div>
          </motion.div>
          <LoadingButton
            size="lg"
            className="w-full"
            disabled={!form.formState.isValid}
            onClick={form.handleSubmit(handleFormSubmit)}
            loading={mutation.isPending}
          >
            {form.formState.isValid && <>Proceed</>}
            {!form.formState.isValid && (
              <>At least 1 participant is required.</>
            )}
          </LoadingButton>
        </motion.div>
      </div>
    </Form>
  );
};
