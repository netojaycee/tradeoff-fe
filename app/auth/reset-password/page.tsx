"use client"
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { CustomButton, CustomInput, AuthLayout } from '@/components/local/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { PasswordStrength } from '@/components/local/shared/PasswordStrength'
import { useChangePasswordMutation } from '@/redux/api'
import { resetPasswordSchema, type ResetPasswordCredentials } from '@/lib/schema'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const tempPassword = searchParams.get("temp") || ""
  
  const [
    changePassword,
    {
      isLoading: isLoadingChangePassword,
      isSuccess: isSuccessChangePassword,
      isError: isErrorChangePassword,
      error: errorChangePassword,
    },
  ] = useChangePasswordMutation()

  const form = useForm<ResetPasswordCredentials>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      temporary_password: tempPassword,
      new_password: '',
      confirm_password: '',
    },
  })

  const newPassword = form.watch("new_password")

  // Auto-fill temporary password if provided in query params
  useEffect(() => {
    if (tempPassword) {
      form.setValue("temporary_password", tempPassword)
    }
  }, [tempPassword, form])

  const onSubmit = async (values: ResetPasswordCredentials) => {
    try {
      
      await changePassword({
        email: email,
        password: values.new_password,
        resetToken: values.temporary_password,
      }).unwrap()
    } catch (error) {
      console.error('Reset password error:', error)
    }
  }

  useEffect(() => {
    if (isSuccessChangePassword) {
      toast.success('Password reset successfully!')
      // Navigate to login page
      setTimeout(() => {
        router.push('/auth/login')
      }, 1500)
    } else if (isErrorChangePassword) {
      if ('data' in errorChangePassword && typeof errorChangePassword.data === 'object') {
        const errorMessage = (errorChangePassword.data as { error?: string })?.error
        toast.error(errorMessage || 'Failed to reset password')
      } else {
        toast.error('Failed to reset password')
      }
    }
  }, [isSuccessChangePassword, isErrorChangePassword, errorChangePassword, router])

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
            name="temporary_password"
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
            name="new_password"
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
                {newPassword && (
                  <PasswordStrength password={newPassword} />
                )}
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
            disabled={isLoadingChangePassword}
            loading={isLoadingChangePassword}
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