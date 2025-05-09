"use client";

import { EmailInput } from "@/components/email-input";
import { LoadingButton } from "@/components/button-with-loading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLogin } from "@/mutations/auth/login";

import { schema, LoginFormSchema } from "@/app/login/schema";

export const LoginForm = () => {
  const [redirectUrl] = useQueryState("redirect-url");

  const form = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      redirectUrl: redirectUrl || "/",
    },
    resolver: zodResolver(schema),
  });

  const mutation = useMutation(useLogin());

  const handleFormSubmit = async (data: LoginFormSchema) => {
    mutation.mutate({
      ...data,
      redirectUrl: redirectUrl || "/",
    });
  };

  return (
    <Form {...form}>
      <div className="flex flex-col h-[100dvh] justify-center items-center">
        <div className="flex flex-col max-w-[400px] w-full gap-4">
          <h2 className="text-lg font-normal">Login to continue</h2>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="w-full"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>Email</FormLabel>
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative w-full">
                      <FormControl>
                        <EmailInput {...field} />
                      </FormControl>
                    </div>
                    <LoadingButton
                      disabled={!form.formState.isDirty || mutation.isPending}
                      className="w-full"
                      loading={mutation.isPending}
                    >
                      Continue
                    </LoadingButton>
                  </div>
                  <FormMessage />
                  <FormDescription>
                    If you have an account, you will receive a one-time password
                    at your email address.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </div>
      </div>
    </Form>
  );
};
