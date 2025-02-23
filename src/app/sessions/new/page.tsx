import { Suspense } from "react";

import { SessionForm } from "./form";

import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { useUsers } from "@/queries/users";

const FormPage = async () => {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(useUsers());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <SessionForm />
      </Suspense>
    </HydrationBoundary>
  );
};

export default FormPage;
