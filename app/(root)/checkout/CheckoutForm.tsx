"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'

import { CustomInput } from '@/components/local/shared/CustomInput'
import { CustomButton } from '@/components/local/shared/CustomButton'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

import { checkoutSchema, type CheckoutCredentials } from '@/lib/schema'
import { correctStates, correctLGAs } from '@/lib/data/nigeria-data'

interface AddressSuggestion {
  display_name: string
  lat: string
  lon: string
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutCredentials) => Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<CheckoutCredentials>
}

export default function CheckoutForm({ onSubmit, isLoading = false, defaultValues }: CheckoutFormProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const form = useForm<CheckoutCredentials>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: 'Samuel',
      lastName: 'Edeh',
      phoneNumber: '+234 90 345 678 90',
      email: 'samuel.pet@example.com',
      state: '',
      lga: '',
      streetAddress: '',
      useSavedInfo: true,
      paymentMethod: 'card',
      ...defaultValues,
    },
  })

  const selectedState = form.watch('state')
  const selectedLGA = form.watch('lga')
  const streetAddress = form.watch('streetAddress')

  // Get LGAs for selected state using useMemo
  const availableLGAs = useMemo(() => {
    return selectedState ? (correctLGAs[selectedState as keyof typeof correctLGAs] || []) : []
  }, [selectedState]) as string[]

  // Clear LGA when state changes
  useEffect(() => {
    if (selectedState && selectedLGA && !availableLGAs.includes(selectedLGA)) {
      form.setValue('lga', '')
    }
  }, [selectedState, selectedLGA, availableLGAs, form])

  // Fetch address suggestions from OpenStreetMap Nominatim
  useEffect(() => {
    if (streetAddress && streetAddress.length > 3 && selectedState && selectedLGA) {
      const searchQuery = `${streetAddress}, ${selectedLGA}, ${selectedState}, Nigeria`
      
      const timeoutId = setTimeout(async () => {
        setIsLoadingSuggestions(true)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=ng`
          )
          const data = await response.json()
          setAddressSuggestions(data)
          setShowSuggestions(data.length > 0)
        } catch (error) {
          console.error('Error fetching address suggestions:', error)
          setAddressSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsLoadingSuggestions(false)
        }
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setAddressSuggestions([])
      setShowSuggestions(false)
    }
  }, [streetAddress, selectedState, selectedLGA])

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false)
    }

    if (showSuggestions) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showSuggestions])

  const handleAddressSuggestionClick = (suggestion: AddressSuggestion) => {
    // Use the full address instead of truncating it
    form.setValue('streetAddress', suggestion.display_name)
    setShowSuggestions(false)
  }

  const handleSubmit = async (values: CheckoutCredentials) => {
    await onSubmit(values)
  }

  return (
    <div className="space-y-6">
      {/* Order Details */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
          <span className="text-sm text-gray-600">1 item</span>
        </div>
        
        <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <Icon icon="material-symbols:shopping-bag-outline" className="w-8 h-8 text-gray-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">LV Remix Boat Shoe Black - 45</h3>
            <p className="text-lg font-semibold text-gray-900">N24,000.00</p>
          </div>
          <div className="text-sm text-gray-600">
            Qty: 1
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252] font-medium">
                      First name
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        type="text"
                        placeholder="Samuel"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252] font-medium">
                      Last name
                    </FormLabel>
                    <FormControl>
                      <CustomInput
                        type="text"
                        placeholder="Edeh"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-[#525252] font-medium">
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <CustomInput
                      type="tel"
                      placeholder="+234 90 345 678 90"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="text-[#525252] font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <CustomInput
                      type="email"
                      placeholder="samuel.pet@example.com"
                      icon="material-symbols:mail-outline"
                      iconPosition="left"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Use Saved Info Checkbox */}
            <FormField
              control={form.control}
              name="useSavedInfo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-gray-700">
                      Use saved info from profile
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Delivery Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* State */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252] font-medium">
                      State
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {correctStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* LGA/City */}
              <FormField
                control={form.control}
                name="lga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#525252] font-medium">
                      LGA/City
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!selectedState}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select LGA/City" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableLGAs.map((lga) => (
                          <SelectItem key={lga} value={lga}>
                            {lga}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Street Address with Nominatim Integration */}
            <FormField
              control={form.control}
              name="streetAddress"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel className="text-[#525252] font-medium">
                    Street address
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CustomInput
                        type="text"
                        placeholder="e.g 123 Main Street"
                        {...field}
                      />
                      {isLoadingSuggestions && (
                        <div className="absolute right-3 top-3 text-gray-400">
                          <Icon icon="material-symbols:progress-activity" className="w-5 h-5 animate-spin" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  
                  {/* Address Suggestions */}
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div 
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleAddressSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-sm text-gray-900">{suggestion.display_name}</div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">N24,000.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery fee</span>
                <span className="font-semibold">N2,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">N1,000.00</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">N27,500.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <CustomButton
            type="submit"
            className="w-full bg-[#38BDF8] hover:bg-[#2abdfc] text-white py-4 text-lg font-medium rounded-lg"
            disabled={isLoading}
            loading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </CustomButton>
        </form>
      </Form>
    </div>
  )
}