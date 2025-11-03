"use client"

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useVerifyMutation, useSendOTPMutation } from '@/redux/api'
import { CustomButton, AuthLayout, OTPInput } from '@/components/local/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'
import { cn } from '@/lib/utils'

// Custom schema for OTP form
const otpFormSchema = z.object({
  code: z.string().length(6, 'Code must be 6 characters'),
})

type OTPFormData = z.infer<typeof otpFormSchema>

export default function VerifyOTP() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const type = (searchParams.get('type') as 'register' | 'forgot-password') || 'register'
  
  const [otpValue, setOtpValue] = useState('')
  const [countdown, setCountdown] = useState(60)
  const canResend = countdown === 0
  
  const [
    verify,
    {
      isLoading: isLoadingVerify,
      isSuccess: isSuccessVerify,
      isError: isErrorVerify,
      error: errorVerify,
    },
  ] = useVerifyMutation()

  const [
    sendOTP,
    {
      isLoading: isLoadingResend,
      isSuccess: isSuccessResend,
    },
  ] = useSendOTPMutation()

  const form = useForm<OTPFormData>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      code: '',
    },
  })

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
      toast.success('Verification Successful')
      if (type === 'register') {
        router.push('/auth/login')
      } else {
        router.push('/auth/reset-password')
      }
      return
    }
    
    if (isErrorVerify) {
      if ('data' in errorVerify && typeof errorVerify.data === 'object') {
        const errorMessage = (errorVerify.data as { error?: string })?.error
        toast.error(errorMessage || 'Verification failed')
      } else {
        toast.error('Verification failed')
      }
      // Use setTimeout to avoid effect setState warning
      setTimeout(() => {
        setOtpValue('')
        form.reset()
      }, 0)
    }
  }, [isSuccessVerify, isErrorVerify, errorVerify, router, type, form])

  // Handle resend success
  useEffect(() => {
    if (isSuccessResend) {
      toast.success('New code sent to your email')
      // Use setTimeout to avoid effect setState warning
      setTimeout(() => {
        setCountdown(60)
      }, 0)
    }
  }, [isSuccessResend])

  const onSubmit = async (values: OTPFormData) => {
    try {
      await verify({
        email,
        code: values.code,
      }).unwrap()
    } catch (error) {
      console.error('Verify error:', error)
    }
  }

  const handleOTPComplete = (otp: string) => {
    form.setValue('code', otp)
    onSubmit({ code: otp })
  }

  const handleOTPChange = (otp: string) => {
    setOtpValue(otp)
    form.setValue('code', otp)
  }

  const handleResend = async () => {
    if (!canResend) return
    
    try {
      await sendOTP({
        email,
        type,
      }).unwrap()
    } catch (error) {
      console.error('Resend error:', error)
      toast.error('Failed to resend code')
    }
  }

  const getTitle = () => {
    return type === 'register' ? 'OTP Verification' : 'Reset Password'
  }

  const getSubtitle = () => {
    return `We sent a 6-digit code to ${email} for verification purpose`
  }

  return (
    <AuthLayout
      title={getTitle()}
      subtitle={getSubtitle()}
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
              disabled={!canResend || isLoadingResend}
              className={cn(
                "font-medium transition-colors",
                canResend && !isLoadingResend
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
            Submit
          </CustomButton>
        </form>
      </Form>

      {/* Back to previous step */}
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          ← Back to previous step
        </button>
      </div>
    </AuthLayout>
  )
}