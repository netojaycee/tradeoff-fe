"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterMutation } from '@/lib/api'
import { CustomButton, CustomInput, AuthLayout, PasswordStrength } from '@/components/local'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { registerFormSchema, type RegisterCredentials } from '@/lib/schema'
import { useRedirectIfAuthenticated } from '@/lib/hooks/useAuth'

// Form data interface (includes confirmPassword for frontend validation)
type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function Register() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  
  // Redirect to dashboard if already authenticated
  const { isLoading: authLoading } = useRedirectIfAuthenticated('/dashboard')
  
  // Use TanStack Query mutation
  const registerMutation = useRegisterMutation()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  })

  const onSubmit = async (values: RegisterFormData) => {
    try {
      // Create API data without confirmPassword
      const apiData: RegisterCredentials = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
      }
      
      // Use TanStack Query mutation
      const result = await registerMutation.mutateAsync(apiData)
      
      // If we get here, the mutation was successful
      toast.success('Registration successful! Please check your email for verification code.')
      // Store email in localStorage for verification page
      localStorage.setItem('verificationEmail', values.email)
      router.push('/auth/verify-otp')
    } catch (error: unknown) {
      console.error('Register error:', error)
      
      const errorObj = error as { data?: { message?: string }; message?: string }
      toast.error(
        errorObj.data?.message || 
        errorObj.message || 
        'Registration failed. Please try again.'
      )
    }
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    toast.info('Google sign up coming soon!')
  }

  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Get started by securing your account"
    >
      {/* Register Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#525252] font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <CustomInput
                      placeholder="John"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#525252] font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <CustomInput
                      placeholder="Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          {/* Phone Number Field */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Phone Number
                </FormLabel>
                <FormControl>
                  <CustomInput
                    type="tel"
                    placeholder="+234 801 234 5678"
                    icon="mdi:phone-outline"
                    iconPosition="left"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field with Strength Indicator */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#525252] font-medium">
                  Password
                </FormLabel>
                <FormControl>
                  <CustomInput
                    placeholder="••••••••"
                    isPassword
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setPassword(e.target.value)
                    }}
                  />
                </FormControl>
                <PasswordStrength password={password} />
                <FormMessage />
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
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <CustomInput
                    placeholder="••••••••"
                    isPassword
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Footer Links */}
          <div className="mt-4 text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <button
              type="button"
              className="text-[#38BDF8] hover:text-[#2abdfc] font-medium transition-colors"
              onClick={() => router.push('/auth/login')}
            >
              Log in
            </button>
          </div>

          {/* Register Button */}
          <CustomButton
            type="submit"
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
            disabled={registerMutation.isPending}
            loading={registerMutation.isPending}
            loadingText="Creating account..."
          >
            Let&apos;s Go
          </CustomButton>
        </form>
      </Form>

      {/* OR Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-[#E5E5E5]"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-[#E5E5E5]"></div>
      </div>

      {/* Google Sign Up Button */}
      <CustomButton
        type="button"
        variant="outline"
        onClick={handleGoogleSignUp}
        className="w-full border-gray-300 text-gray-700 font-medium py-3 text-base rounded-lg hover:bg-gray-50 transition-colors"
        icon="logos:google-icon"
        iconPosition="left"
      >
        Continue with Google
      </CustomButton>

      {/* Terms and Privacy */}
      <div className="mt-6 text-center text-xs text-gray-500">
        By continuing, I agree to the{' '}
        <button
          type="button"
          className="text-[#38BDF8] hover:text-[#2abdfc] underline"
          onClick={() => {
            // Handle terms navigation
          }}
        >
          Terms & Privacy Policy
        </button>
      </div>
    </AuthLayout>
  )
}