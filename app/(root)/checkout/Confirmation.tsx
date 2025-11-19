"use client"

import React from 'react'
import { Icon } from '@iconify/react'
import { CustomButton } from '@/components/local/custom/CustomButton'

interface OrderDetails {
  orderId: string
  item: string
  size: string
  color: string
  deliveryMethod: string
  deliverTo: string
  paymentMethod: string
  amount: string
}

interface ConfirmationProps {
  orderDetails: OrderDetails
  onTrackOrder?: () => void
  onContinueShopping?: () => void
}

const defaultOrderDetails: OrderDetails = {
  orderId: '#LVX-2025-10459',
  item: 'LV Remix Boat Shoe',
  size: '45',
  color: 'Black',
  deliveryMethod: 'Standard (2-5 business days)',
  deliverTo: '12A Kingsway Road, Ikoyi, Lagos',
  paymentMethod: 'MasterCard',
  amount: 'N27,500,000.00'
}

export default function Confirmation({ 
  orderDetails = defaultOrderDetails, 
  onTrackOrder,
  onContinueShopping 
}: ConfirmationProps) {
  const handleTrackOrder = () => {
    if (onTrackOrder) {
      onTrackOrder()
    } else {
      // Default behavior - you can implement tracking logic here
      console.log('Track order:', orderDetails.orderId)
    }
  }

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping()
    } else {
      // Default behavior - navigate to home or shop page
      window.location.href = '/'
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
          <Icon 
            icon="mdi:check-circle-outline" 
            className="w-10 h-10 text-green-600 font-normal"
          />
      </div>

      {/* Success Message */}
      <div className="text-center mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-gray-600 text-xs">
          Your order is being processed, we&apos;ll notify you once it&apos;s about to be on its way...
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-[#E8E8E8] rounded p-4 mb-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order ID</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.orderId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Item</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.item}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Size</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.size}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Color</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.color}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Delivery Method</span>
            <span className="text-sm font-medium text-gray-900 text-right">
              {orderDetails.deliveryMethod}
            </span>
          </div>
          
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-600">Deliver To</span>
            <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
              {orderDetails.deliverTo}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Method</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.paymentMethod}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]">
            <span className="text-sm text-gray-600">Amount</span>
            <span className="text-lg font-bold text-gray-900">{orderDetails.amount}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <CustomButton
          onClick={handleTrackOrder}
          variant="outline"
          className="w-full py-3 text-gray-900 border-gray-300 hover:bg-gray-50"
        >
          Track Order
        </CustomButton>
        
        <button
          onClick={handleContinueShopping}
          className="w-full text-center text-gray-600 hover:text-gray-900 underline text-sm py-2"
        >
          Continue shopping
        </button>
      </div>
    </div>
  )
}