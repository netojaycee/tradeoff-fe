"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/api";
import { CustomButton, CustomInput, AuthLayout } from "@/components/local";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginSchema, type LoginCredentials } from "@/lib/schema";
import { useRedirectIfAuthenticated } from "@/lib/hooks/useAuth";

export default function Login() {
  const router = useRouter();
  
  // Keep signed in state - Commented out for now
  // const [keepSignedIn, setKeepSignedIn] = useState(() => {
  //   // Initialize state from localStorage
  //   if (typeof window !== 'undefined') {
  //     return localStorage.getItem('keepSignedIn') === 'true';
  //   }
  //   return false;
  // });

  // Redirect to dashboard if already authenticated
  const { isLoading: authLoading } = useRedirectIfAuthenticated("/dashboard");

  const [login, { isLoading: isLoadingLogin, isSuccess: isSuccessLogin }] =
    useLoginMutation();

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginCredentials) => {
    try {
      // Handle keep signed in functionality - Commented out for now
      // if (keepSignedIn) {
      //   // This would send keepSignedIn: true to backend for extended token lifetime (30 days)
      //   localStorage.setItem('savedEmail', values.email);
      // } else {
      //   localStorage.removeItem('savedEmail');
      // }

      const result = await login(values).unwrap();

      if (result.success) {
        toast.success("Login successful!");
        // Get redirect URL from query params or default to dashboard
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get("redirect") || "/dashboard";
        router.push(redirectTo);
      } else {
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);

      const errorObj = error as {
        data?: {
          message?: string;
          code?: string;
          email?: string;
        };
        message?: string;
      };

      // Check for email not verified error
      if (
        errorObj.data?.code === "EMAIL_NOT_VERIFIED" ||
        errorObj.data?.message?.includes("not verified") ||
        errorObj.data?.message?.includes("verify your email")
      ) {
        toast.info(
          "Please verify your email before logging in. A new verification code has been sent."
        );

        // Store email in localStorage for verification page
        localStorage.setItem("verificationEmail", values.email);

        // Redirect to verify OTP page
        router.push("/auth/verify-otp");
        return;
      }

      // Handle other login errors
      toast.error(
        errorObj.data?.message ||
          errorObj.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  useEffect(() => {
    if (isSuccessLogin) {
      toast.success("Login Successful");
    }
  }, [isSuccessLogin]);

  // Load saved email on component mount if keep signed in is enabled - Commented out for now
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const savedKeepSignedIn = localStorage.getItem('keepSignedIn') === 'true';
  //     const savedEmail = localStorage.getItem('savedEmail');
  //     
  //     if (savedKeepSignedIn && savedEmail) {
  //       form.setValue('email', savedEmail);
  //     }
  //   }
  // }, [form]);

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log("Google sign in");
    toast.info("Google sign in coming soon!");
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome Back!"
      subtitle="Enter your email and password to access your account"
    >
      {/* Login Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Email address
                </FormLabel>
                <FormControl>
                  <CustomInput
                    type="email"
                    placeholder="example@gmail.com"
                    icon="material-symbols:mail-outline"
                    iconPosition="left"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <CustomInput placeholder="••••••••" isPassword {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer Links */}
          <div className="mt-4 flex flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
            {/* Keep me signed in checkbox - Commented out for now */}
            {/* 
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="keepSignedIn"
                checked={rememberMe}
                className="h-4 w-4 text-[#38BDF8] focus:ring-[#38BDF8] border-gray-300 rounded"
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  setRememberMe(isChecked);
                  // Store keep signed in preference - will extend token lifetime to 30 days
                  localStorage.setItem('keepSignedIn', isChecked.toString());
                }}
              />
              <label 
                htmlFor="keepSignedIn" 
                className="text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Keep me signed in for 30 days
              </label>
            </div>
            */}
            <div></div> {/* Empty div to maintain spacing */}
            <button
              type="button"
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
              onClick={() => router.push("/auth/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          {/* Start Shopping Button */}
          <CustomButton
            type="submit"
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
            disabled={isLoadingLogin}
            loading={isLoadingLogin}
            loadingText="Signing in..."
          >
            Start Shopping
          </CustomButton>
        </form>
      </Form>

      {/* OR Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      {/* Google Sign In Button */}
      <CustomButton
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full border-gray-300 text-gray-700 font-medium py-3 text-base rounded-lg hover:bg-gray-50 transition-colors"
        icon="logos:google-icon"
        iconPosition="left"
      >
        Continue with Google
      </CustomButton>
      {/* Sign Up Link */}
      <div className="flex items-center justify-center mt-4">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 transition-colors"
          onClick={() => router.push("/auth/register")}
        >
          Don&apos;t have an account?{" "}
          <span className="text-[#38BDF8] hover:text-[#2abdfc] font-medium">
            Sign up
          </span>
        </button>
      </div>
    </AuthLayout>
  );
}
