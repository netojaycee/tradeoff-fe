"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVerifyEmailMutation, useResendVerificationMutation } from '@/redux/api'
import { CustomButton, AuthLayout, OTPInput } from '@/components/local'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { verifyEmailSchema, type VerifyEmailCredentials } from '@/lib/schema'
import { cn } from '@/lib/utils'

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailFromQuery = searchParams.get('email')
  const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('verificationEmail') : null
  const email = emailFromQuery || emailFromStorage || ''
  
  const [otpValue, setOtpValue] = useState('')
  const [countdown, setCountdown] = useState(60)
  const canResend = countdown === 0
  
  const [
    verifyEmail,
    {
      isLoading: isLoadingVerify,
      isSuccess: isSuccessVerify,
      isError: isErrorVerify,
      error: errorVerify,
    },
  ] = useVerifyEmailMutation()

  const [
    resendVerification,
    {
      isLoading: isLoadingResend,
      isSuccess: isSuccessResend,
      isError: isErrorResend,
      error: errorResend,
    },
  ] = useResendVerificationMutation()

  const form = useForm<VerifyEmailCredentials>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      code: '',
    },
  })

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error('No email found. Please register first.')
      router.push('/auth/register')
    } else {
      // Update form email when email changes
      form.setValue('email', email)
    }
  }, [email, router, form])

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // Handle verification results
  useEffect(() => {
    if (isSuccessVerify) {
      toast.success('Email verified successfully! You can now log in.')
      // Clear stored email
      if (typeof window !== 'undefined') {
        localStorage.removeItem('verificationEmail')
      }
      router.push('/auth/login')
    }
    
    if (isErrorVerify) {
      if ('data' in errorVerify && typeof errorVerify.data === 'object') {
        const errorMessage = (errorVerify.data as { message?: string })?.message
        toast.error(errorMessage || 'Verification failed')
      } else {
        toast.error('Verification failed. Please try again.')
      }
      // Reset form
      setTimeout(() => {
        setOtpValue('')
        form.reset()
      }, 0)
    }
  }, [isSuccessVerify, isErrorVerify, errorVerify, router, form])

  // Handle resend results
  useEffect(() => {
    if (isSuccessResend) {
      toast.success('New verification code sent to your email')
      setTimeout(() => {
        setCountdown(60)
      }, 0)
    }
    
    if (isErrorResend) {
      if ('data' in errorResend && typeof errorResend.data === 'object') {
        const errorMessage = (errorResend.data as { message?: string })?.message
        toast.error(errorMessage || 'Failed to resend code')
      } else {
        toast.error('Failed to resend verification code')
      }
    }
  }, [isSuccessResend, isErrorResend, errorResend])

  const onSubmit = async (values: VerifyEmailCredentials) => {
    try {
      await verifyEmail({
        // email: values.email,
        code: values.code,
      }).unwrap()
      
      // Success handling is done in useEffect
    } catch (error: unknown) {
      console.error('Verify error:', error)
      // Error handling is done in useEffect - no toast here to avoid duplicates
    }
  }

  const handleOTPComplete = (otp: string) => {
    form.setValue('code', otp)
    onSubmit({ email, code: otp })
  }

  const handleOTPChange = (otp: string) => {
    setOtpValue(otp)
    form.setValue('code', otp)
    // Also update email in form
    form.setValue('email', email)
  }

  const handleResend = async () => {
    if (!canResend || !email) return
    
    try {
      const result = await resendVerification({ email }).unwrap()
      
      if (result.success) {
        toast.success('New verification code sent to your email')
        setCountdown(60)
      } else {
        toast.error(result.message || 'Failed to resend code')
      }
    } catch (error: unknown) {
      console.error('Resend error:', error)
      
      const errorObj = error as { data?: { message?: string }; message?: string }
      toast.error(
        errorObj.data?.message || 
        errorObj.message || 
        'Failed to resend verification code'
      )
    }
  }

  return (
    <AuthLayout
      title="Email Verification"
      subtitle={`We sent a 6-digit code to ${email} for verification purpose`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* OTP Input */}
          <FormField
            control={form.control}
            name="code"
            render={() => (
              <FormItem>
                <FormControl>
                  <OTPInput
                    length={6}
                    value={otpValue}
                    onChange={handleOTPChange}
                    onComplete={handleOTPComplete}
                    disabled={isLoadingVerify}
                    className="my-8"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Resend Section */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Didn&apos;t get the code? </span>
            <button
              type="button"
              onClick={handleResend}
              disabled={!canResend || isLoadingResend || !email}
              className={cn(
                "font-medium transition-colors",
                canResend && !isLoadingResend && email
                  ? "text-[#38BDF8] hover:text-[#2abdfc] cursor-pointer"
                  : "text-gray-400 cursor-not-allowed"
              )}
            >
              {isLoadingResend ? 'Sending...' : canResend ? 'Resend' : `Resend in ${countdown}s`}
            </button>
          </div>

          {/* Submit Button */}
          <CustomButton
            type="submit"
            className="w-full text-white font-medium py-3 text-base rounded-sm transition-colors"
            disabled={isLoadingVerify || otpValue.length !== 6}
            loading={isLoadingVerify}
            loadingText="Verifying..."
          >
            Verify Email
          </CustomButton>
        </form>
      </Form>

      {/* Back to previous step */}
      <div className="mt-6 text-center space-y-2">
        <button
          type="button"
          onClick={() => router.push('/auth/login')}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors block mx-auto"
        >
          ← Back to Login
        </button>
        <div className="text-xs text-gray-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/register')}
            className="text-[#38BDF8] hover:text-[#2abdfc] font-medium transition-colors"
          >
            Sign up here
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}