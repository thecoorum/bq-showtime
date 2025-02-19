"use client";

import { useEffect } from "react";

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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useConfirm } from "@/mutations/auth/confirm";

export const schema = z.object({
  email: z.string().email(),
  token: z
    .string()
    .min(6, { message: "One-time password should be 6 symbols" })
    .max(6, { message: "One-time password should be 6 symbols" }),
  redirectUrl: z.string(),
});

export type LoginConfirmFormSchema = z.infer<typeof schema>;

const ConfirmPage = () => {
  const [email] = useQueryState("email");
  const [redirectUrl] = useQueryState("redirect-url");

  const form = useForm<LoginConfirmFormSchema>({
    defaultValues: {
      email: email || "",
      redirectUrl: redirectUrl || "/",
      token: "",
    },
    resolver: zodResolver(schema),
  });

  const token = form.watch("token");

  const mutation = useMutation(useConfirm());

  useEffect(() => {
    if (token.length === 6) {
      form.handleSubmit(handleFormSubmit)();
    }
  }, [token]);

  const handleFormSubmit = async (data: LoginConfirmFormSchema) => {
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
              name="token"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1">
                  <FormLabel>One-time password</FormLabel>
                  <div className="flex flex-col gap-2 sm:gap-4">
                    <div>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                    </div>
                    <LoadingButton
                      className="cursor-pointer"
                      disabled={!form.formState.isDirty || mutation.isPending}
                      loading={mutation.isPending}
                    >
                      Log in
                    </LoadingButton>
                  </div>
                  <FormMessage />
                  <FormDescription>
                    Enter the one-time password that was sent to your email.
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

export default ConfirmPage;
