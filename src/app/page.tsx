import { Suspense } from "react";

import { SessionForm } from "./form";

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { useUpcomingSession } from "@/queries/upcoming-session";
import { useUsers } from "@/queries/users";

import type { UpcomingSessionResponse } from "@/actions/sessions";

const Home = async () => {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(useUpcomingSession()),
    queryClient.prefetchQuery(useUsers()),
  ]);

  const session = (await queryClient.getQueryData([
    "upcoming-session",
  ])) as UpcomingSessionResponse;

  if (!session) {
    redirect("/sessions/new");
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SessionForm />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Home;
