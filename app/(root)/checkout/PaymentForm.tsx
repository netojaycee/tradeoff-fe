"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Icon } from '@iconify/react'

import { CustomInput } from '@/components/local/custom/CustomInput'
import { CustomButton } from '@/components/local/custom/CustomButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'

const paymentSchema = z.object({
  cardholderName: z.string().min(1, 'Cardholder name is required'),
  cardNumber: z.string().min(16, 'Card number must be at least 16 digits').max(19, 'Card number is too long'),
  expirationDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Enter valid expiration date (MM/YYYY)'),
  securityCode: z.string().min(3, 'Security code must be at least 3 digits').max(4, 'Security code is too long'),
  saveCardInfo: z.boolean().optional(),
})

type PaymentCredentials = z.infer<typeof paymentSchema>

interface PaymentFormProps {
  onPaymentSubmit: (data: PaymentCredentials) => Promise<void>
  isLoading?: boolean
}

export default function PaymentForm({ onPaymentSubmit, isLoading = false }: PaymentFormProps) {
  const [cardType, setCardType] = useState<string>('')

  const form = useForm<PaymentCredentials>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardholderName: 'Samuel Edeh',
      cardNumber: '',
      expirationDate: '',
      securityCode: '',
      saveCardInfo: false,
    },
  })

  const detectCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '')
    
    if (cleaned.startsWith('4')) {
      return 'visa'
    } else if (cleaned.startsWith('5') || (cleaned.startsWith('2') && cleaned.length >= 2 && parseInt(cleaned.substring(0, 2)) >= 22 && parseInt(cleaned.substring(0, 2)) <= 27)) {
      return 'mastercard'
    } else if (cleaned.startsWith('506') || cleaned.startsWith('650') || cleaned.startsWith('507')) {
      return 'verve'
    }
    return ''
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const chunks = cleaned.match(/.{1,4}/g) || []
    return chunks.join(' ').substr(0, 19) // Limit to 19 characters (16 digits + 3 spaces)
  }

  const formatExpirationDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 6)
    }
    return cleaned
  }

  const onSubmit = async (values: PaymentCredentials) => {
    await onPaymentSubmit(values)
  }

  const CardIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'visa':
        return <div className="text-blue-600 font-bold text-xs">VISA</div>
      case 'mastercard':
        return <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
          <div className="w-4 h-4 bg-yellow-500 rounded-full -ml-2"></div>
        </div>
      case 'verve':
        return <div className="text-green-600 font-bold text-xs">VERVE</div>
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Credit Card Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Cardholder Name */}
          <FormField
            control={form.control}
            name="cardholderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Cardholder name
                </FormLabel>
                <FormControl>
                  <CustomInput
                    type="text"
                    placeholder="e.g Samuel Edeh"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Card Number */}
          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Card number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <CustomInput
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        const type = detectCardType(formatted)
                        setCardType(type)
                        field.onChange(formatted)
                      }}
                    />
                    <div className="absolute right-3 top-3 flex items-center space-x-1">
                      {cardType ? (
                        <CardIcon type={cardType} />
                      ) : (
                        <>
                          <div className="text-blue-600 font-bold text-xs">VISA</div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full -ml-1"></div>
                          </div>
                          <div className="text-green-600 font-bold text-xs">VERVE</div>
                        </>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Expiration Date */}
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Expiration date
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CustomInput
                        type="text"
                        placeholder="MM/YYYY"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatExpirationDate(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                      <Icon 
                        icon="material-symbols:calendar-today-outline" 
                        className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Security Code */}
            <FormField
              control={form.control}
              name="securityCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">
                    Security code
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CustomInput
                        type="text"
                        placeholder="CVC"
                        maxLength={4}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          field.onChange(value)
                        }}
                      />
                      <Icon 
                        icon="material-symbols:credit-card-outline" 
                        className="absolute right-3 top-3 w-5 h-5 text-gray-400"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Save Card Info Checkbox */}
          <FormField
            control={form.control}
            name="saveCardInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm text-gray-700">
                    Save card info for future use
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          {/* Secure Payment Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <div className="flex items-start">
              <Icon 
                icon="material-symbols:lock-outline" 
                className="w-5 h-5 text-green-600 mt-0.5 mr-3 shrink-0"
              />
              <div>
                <h4 className="text-sm font-medium text-green-800">Secure Payment</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your payment is encrypted and 100% secure. We never store your card details
                </p>
              </div>
            </div>
          </div>

          {/* Pay Now Button */}
          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#38BDF8] hover:bg-[#2abdfc] text-white py-4 text-lg font-medium rounded-lg mt-6"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Icon icon="material-symbols:progress-activity" className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              `Pay Now`
            )}
          </CustomButton>
        </form>
      </Form>
    </div>
  )
}