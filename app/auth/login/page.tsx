"use client"

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoginMutation } from '@/redux/api'
import { CustomButton, CustomInput, AuthLayout } from '@/components/local/shared'
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
import { loginSchema, type LoginCredentials } from '@/lib/schema'

export default function Login() {
  const router = useRouter()
  
  const [
    login,
    {
      isLoading: isLoadingLogin,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin,
    },
  ] = useLoginMutation()

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginCredentials) => {
    try {
      await login(values).unwrap()
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  useEffect(() => {
    if (isSuccessLogin) {
      toast.success('Login Successful')
      router.push('/')
    } else if (isErrorLogin) {
      if ('data' in errorLogin && typeof errorLogin.data === 'object') {
        const errorMessage = (errorLogin.data as { error?: string })?.error
        toast.error(errorMessage || 'Login failed')
      } else {
        toast.error('Login failed')
      }
    }
  }, [isSuccessLogin, isErrorLogin, errorLogin, router])

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Google sign in')
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
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm space-y-2 sm:space-y-0">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 transition-colors"
                           onClick={() => router.push('/auth/register')}

            >
              Don&apos;t have an account?{' '}
              <span className="text-[#38BDF8] hover:text-[#2abdfc] font-medium">
                Sign up
              </span>
            </button>
            <button
              type="button"
              className="text-red-500 hover:text-red-600 font-medium transition-colors"
                            onClick={() => router.push('/auth/forgot-password')}
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
    </AuthLayout>
  )
}
