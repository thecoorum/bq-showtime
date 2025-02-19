"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { UsersList } from "./users-list";

import { format } from "date-fns";
import Link from "next/link";
import { Settings } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { useUpcomingSession } from "@/queries/upcoming-session";

const schema = z.object({
  participants: z.array(z.string()),
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

  const handleSubmit = (data: UpcomingSessionFormSchema) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="flex flex-col gap-6 max-w-[400px] w-full">
          <h2 className="text-2xl font-bold">Upcoming session</h2>
          <div className="flex items-center justify-between">
            <p>Session participants</p>
            <UsersList />
          </div>
        </div>
      </div>
    </Form>
  );
};
