import { SessionPlayer } from "./player";

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { notFound } from "next/navigation";

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

  console.log("session", session);

  if (!session) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SessionPlayer id={id} />
    </HydrationBoundary>
  );
};

export default SessionPage;
