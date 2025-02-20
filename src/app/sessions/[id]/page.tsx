import { SessionPlayer } from "./player";

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { differenceInSeconds } from "date-fns";

import { useSession } from "@/queries/session";

import type { SessionResponse } from "@/actions/sessions";

const SessionPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const queryClient = new QueryClient();

  const { id } = await params;

  try {
    await queryClient.prefetchQuery(useSession(id));
  } catch (error) {
    console.error("session error", error);
  }

  const session = (await queryClient.getQueryData([
    "sessions",
    id,
  ])) as SessionResponse;

  if (!session) {
    redirect("/");
  }

  const difference = differenceInSeconds(
    session.starts_at,
    new Date().toISOString(),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionPlayer id={id} countdown={difference} />
    </HydrationBoundary>
  );
};

export default SessionPage;
