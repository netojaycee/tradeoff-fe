"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Icon } from '@iconify/react'

import { CustomButton, CustomInput, AuthLayout } from '@/components/local'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForgotPasswordMutation } from '@/lib/api'
import { forgotPasswordSchema, type ForgotPasswordCredentials } from '@/lib/schema'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  const forgotPasswordMutation = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordCredentials>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: ForgotPasswordCredentials) => {
    try {
      await forgotPasswordMutation.mutateAsync(values)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Send OTP error:', error)
    }
  }

  useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      toast.success('Reset code sent to your email!')
      // Navigate to reset password page with email in query
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(form.getValues('email'))}`)
      }, 1500)
    } else if (forgotPasswordMutation.isError) {
      const error = forgotPasswordMutation.error as any
      const errorMessage = error?.message || 'Failed to send reset code'
      toast.error(errorMessage)
    }
  }, [forgotPasswordMutation.isSuccess, forgotPasswordMutation.isError, forgotPasswordMutation.error, router, form])

  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check Your Email" 
        subtitle={`We've sent a password reset code to ${form.getValues('email')}`}
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Icon icon="material-symbols:mail-outline" className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Please check your email and enter the verification code along with your new password.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or try again.
            </p>
          </div>

          <CustomButton
            onClick={() => router.push(`/auth/reset-password?email=${encodeURIComponent(form.getValues('email'))}`)}
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
          >
            Continue to Reset Password
          </CustomButton>

          <CustomButton
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="w-full border-gray-300 text-gray-700 font-medium py-3 text-base rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Different Email
          </CustomButton>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Forgot Password?" 
      subtitle="No worries, we'll send you reset instructions."
    >
      {/* Forgot Password Form */}
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

          {/* Send Reset Code Button */}
          <CustomButton
            type="submit"
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
            disabled={forgotPasswordMutation.isPending}
            loading={forgotPasswordMutation.isPending}
            loadingText="Sending..."
          >
            Send Reset Code
          </CustomButton>
        </form>
      </Form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          type="button"
          className="text-gray-600 hover:text-gray-800 transition-colors text-sm"
          onClick={() => router.push('/auth/login')}
        >
          <span className="text-[#38BDF8] hover:text-[#2abdfc] font-medium">
            ← Back to Login
          </span>
        </button>
      </div>
    </AuthLayout>
  )
}