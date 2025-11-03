"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRegisterMutation } from '@/redux/api'
import { CustomButton, CustomInput, AuthLayout, PasswordStrength } from '@/components/local/shared'
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
import { registerSchema, type RegisterCredentials } from '@/lib/schema'

export default function Register() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  
  const [
    register,
    {
      isLoading: isLoadingRegister,
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      error: errorRegister,
    },
  ] = useRegisterMutation()

  const form = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (values: RegisterCredentials) => {
    try {
      await register(values).unwrap()
    } catch (error) {
      console.error('Register error:', error)
    }
  }

  useEffect(() => {
    if (isSuccessRegister) {
      toast.success('Registration Successful')
      router.push('/auth/verify-otp')
    } else if (isErrorRegister) {
      if ('data' in errorRegister && typeof errorRegister.data === 'object') {
        const errorMessage = (errorRegister.data as { error?: string })?.error
        toast.error(errorMessage || 'Registration failed')
      } else {
        toast.error('Registration failed')
      }
    }
  }, [isSuccessRegister, isErrorRegister, errorRegister, router])

  const handleGoogleSignUp = () => {
    // Handle Google sign up logic here
    console.log('Google sign up')
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
              name="first_name"
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
              name="last_name"
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
            name="confirm_password"
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
            disabled={isLoadingRegister}
            loading={isLoadingRegister}
            loadingText="Creating account..."
          >
            Let&apos;s Go
          </CustomButton>
        </form>
      </Form>

      {/* OR Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-gray-500 text-sm">OR</span>
        <div className="flex-1 border-t border-gray-200"></div>
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
            console.log('Navigate to terms')
          }}
        >
          Terms & Privacy Policy
        </button>
      </div>
    </AuthLayout>
  )
}