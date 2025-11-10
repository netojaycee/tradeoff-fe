"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  CustomButton,
  CustomInput,
  AuthLayout,
} from "@/components/local";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordStrength } from "@/components/local/general/PasswordStrength";
import { useResetPasswordMutation } from "@/redux/api";
import {
  resetPasswordSchema,
  type ResetPasswordCredentials,
} from "@/lib/schema";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const email = searchParams.get("email") || ""
  const tempPassword = searchParams.get("code") || "";

  const [
    resetPassword,
    {
      isLoading: isLoadingResetPassword,
      isSuccess: isSuccessResetPassword,
      isError: isErrorResetPassword,
      error: errorResetPassword,
    },
  ] = useResetPasswordMutation();

  const form = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: tempPassword,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = form.watch("newPassword");

  // Auto-fill temporary password if provided in query params
  useEffect(() => {
    if (tempPassword) {
      form.setValue("code", tempPassword);
    }
  }, [tempPassword, form]);

  const onSubmit = async (values: ResetPasswordCredentials) => {
    try {
      await resetPassword({
        newPassword: values.newPassword,
        code: values.code,
      }).unwrap();
    } catch (error) {
      console.error("Reset password error:", error);
    }
  };

  useEffect(() => {
    if (isSuccessResetPassword) {
      toast.success("Password reset successfully!");
      // Navigate to login page
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } else if (isErrorResetPassword) {
      if (
        "data" in errorResetPassword &&
        typeof errorResetPassword.data === "object"
      ) {
        const errorMessage = (errorResetPassword.data as { error?: string })
          ?.error;
        toast.error(errorMessage || "Failed to reset password");
      } else {
        toast.error("Failed to reset password");
      }
    }
  }, [
    isSuccessResetPassword,
    isErrorResetPassword,
    errorResetPassword,
    router,
  ]);

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a strong password for your account"
    >
      {/* Reset Password Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Temporary Password Field */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Temporary Password
                </FormLabel>
                <FormControl>
                  <CustomInput
                    type="text"
                    placeholder="Enter the code sent to your email"
                    icon="material-symbols:key-outline"
                    iconPosition="left"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* New Password Field */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  New Password
                </FormLabel>
                <FormControl>
                  <CustomInput
                    placeholder="Enter your new password"
                    isPassword
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                {newPassword && <PasswordStrength password={newPassword} />}
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Confirm New Password
                </FormLabel>
                <FormControl>
                  <CustomInput
                    placeholder="Confirm your new password"
                    isPassword
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Requirements */}
          {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon icon="material-symbols:info-outline" className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Password Requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li>• At least 6 characters long</li>
                  <li>• Include both uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                  <li>• Include at least one special character</li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Update Password Button */}
          <CustomButton
            type="submit"
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
            disabled={isLoadingResetPassword}
            loading={isLoadingResetPassword}
            loadingText="Updating Password..."
          >
            Update Password
          </CustomButton>
        </form>
      </Form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          onClick={() => router.push("/auth/login")}
        >
          <span className="text-[#38BDF8] hover:text-[#2abdfc] font-medium">
            ← Back to Login
          </span>
        </button>
      </div>
    </AuthLayout>
  );
}
