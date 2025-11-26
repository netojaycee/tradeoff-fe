"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/lib/stores";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Image from "next/image";

import { CustomInput } from "@/components/local/custom/CustomInput";
import { CustomButton } from "@/components/local/custom/CustomButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { checkoutSchema, type CheckoutCredentials } from "@/lib/schema";
import { correctStates, correctLGAs } from "@/lib/data/nigeria-data";
import { formatPrice } from "@/lib/utils";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutCredentials) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<CheckoutCredentials>;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function CheckoutForm({
  onSubmit,
  isLoading = false,
  defaultValues,
}: CheckoutFormProps) {
  // Get cart items from Zustand store
  const { items: cartItems } = useCartStore();
  // Calculate order summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = cartItems.length > 0 ? 2500 : 0;
  const tax = cartItems.length > 0 ? 1000 : 0;
  const total = subtotal + deliveryFee + tax;
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const form = useForm<CheckoutCredentials>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "Samuel",
      lastName: "Edeh",
      phoneNumber: "+234 90 345 678 90",
      email: "samuel.pet@example.com",
      state: "Lagos",
      lga: "",
      streetAddress: "e.g 123 Main Street",
      useSavedInfo: true,
      paymentMethod: "card",
      ...defaultValues,
    },
  });

  const selectedState = form.watch("state") as string | undefined;
  const availableLGAs = useMemo<string[]>(() => {
    return selectedState
      ? ([
          ...(correctLGAs[selectedState as keyof typeof correctLGAs] || []),
        ] as string[])
      : [];
  }, [selectedState]);

  const streetAddress = form.watch("streetAddress");
  const selectedLGA = form.watch("lga") as string | undefined;

  useEffect(() => {
    if (
      streetAddress &&
      streetAddress.length > 3 &&
      selectedState &&
      selectedLGA
    ) {
      const searchQuery = `${streetAddress}, ${selectedLGA}, ${selectedState}, Nigeria`;

      const timeoutId = setTimeout(async () => {
        setIsLoadingSuggestions(true);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              searchQuery
            )}&limit=5&countrycodes=ng`
          );
          const data = await response.json();
          setAddressSuggestions(data);
          setShowSuggestions(data.length > 0);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          setAddressSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsLoadingSuggestions(false);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  }, [streetAddress, selectedState, selectedLGA]);

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    if (showSuggestions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showSuggestions]);

  const handleAddressSuggestionClick = (suggestion: AddressSuggestion) => {
    // Use the full address instead of truncating it
    form.setValue("streetAddress", suggestion.display_name);
    setShowSuggestions(false);
  };
  useEffect(() => {
    if (selectedState && selectedLGA && !availableLGAs.includes(selectedLGA)) {
      form.setValue("lga", "");
    }
  }, [selectedState, availableLGAs, form, selectedLGA]);

  const handleSubmit = async (values: CheckoutCredentials) => {
    await onSubmit(values);
  };

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid lg:grid-cols-2 gap-6"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-4">
            {/* Contact Information */}
            <div className="rounded border border-[#E5E5E5]">
              <h2 className=" text-[#525252] mb-2 border-b px-2 py-0.5">
                Contact Information
              </h2>

              <div className="space-y-2 px-2 pb-2">
                {/* <div className="grid grid-cols-2 gap-4"> */}
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        First name
                      </FormLabel>
                      <FormControl>
                        <CustomInput placeholder="Samuel" {...field} />
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
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Last name
                      </FormLabel>
                      <FormControl>
                        <CustomInput placeholder="Edeh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* </div> */}

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Phone number
                      </FormLabel>
                      <FormControl>
                        <CustomInput type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        Email
                      </FormLabel>
                      <FormControl>
                        <CustomInput
                          type="email"
                          icon="material-symbols:mail-outline"
                          iconPosition="left"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="useSavedInfo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          className=""
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-xs font-normal cursor-pointer">
                        Use saved info from profile
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Delivery Information */}
            <div className="rounded border border-[#E5E5E5]">
              <h2 className="text-[#525252] mb-2 border-b px-2 py-0.5">
                Delivery Information
              </h2>

              <div className="space-y-2 px-2 pb-2">
                {/* <div className="grid grid-cols-2 gap-4"> */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        State
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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

                <FormField
                  control={form.control}
                  name="lga"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-[#525252] font-normal">
                        City/Town
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!selectedState}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select city/town" />
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
                {/* </div> */}

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
                            autoComplete="address-line1"
                            {...field}
                          />
                          {isLoadingSuggestions && (
                            <div className="absolute right-3 top-3 text-gray-400">
                              <Icon
                                icon="material-symbols:progress-activity"
                                className="w-5 h-5 animate-spin"
                              />
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
                              onClick={() =>
                                handleAddressSuggestionClick(suggestion)
                              }
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="text-sm text-gray-900">
                                {suggestion.display_name}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Order Details */}
            <div className="rounded border border-[#E5E5E5]">
              <div className="flex justify-between items-center text-[#525252] mb-2 border-b px-2 py-0.5">
                <h2 className="font-semibold">Order Details</h2>
                <span className="text-sm text-gray-500">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="space-y-3 px-2 pb-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded">
                    <div className="relative w-20 h-20 bg-[#f5f5f5] rounded overflow-hidden border border-[#E5E5E5]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#404040] line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <div className="mt-2">
                        <p className="text-lg font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded border border-[#E5E5E5]">
              <h2 className="text font-semibold text-[#525252] mb-2 border-b px-2 py-0.5">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm px-2 pb-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#404040] font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="text-[#404040] font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-[#404040] font-medium">{formatPrice(tax)}</span>
                </div>
              </div>
              <div className="border-t px-2 pb-2">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <CustomButton
              type="submit"
              className="w-full"
              disabled={isLoading}
              loading={isLoading}
            >
              Proceed to Payment
            </CustomButton>

            <p className="text-xs text-center text-gray-500">
              By completing this purchase, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
