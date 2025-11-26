"use client"

import React from 'react'
import { Icon } from '@iconify/react'
import { CustomButton } from '@/components/local/custom/CustomButton'
import { formatPrice } from '@/lib/utils'

interface ConfirmationProps {
  orderDetails: any
  onTrackOrder?: () => void
  onContinueShopping?: () => void
}

export default function Confirmation({ 
  orderDetails, 
  onTrackOrder,
  onContinueShopping 
}: ConfirmationProps) {
  if (!orderDetails) {
    return null;
  }

  const handleTrackOrder = () => {
    if (onTrackOrder) {
      onTrackOrder()
    }
  }

  const handleContinueShopping = () => {
    if (onContinueShopping) {
      onContinueShopping()
    } else {
      window.location.href = '/'
    }
  }


  const orderNumber = orderDetails.orderNumber || orderDetails.id || '#ORD-000'
  const totalAmount = orderDetails.totalAmount || orderDetails.total || 0
  const items = Array.isArray(orderDetails.items) ? orderDetails.items : []
  const shippingAddress = orderDetails.shippingAddress || {}

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
          <Icon 
            icon="mdi:check-circle-outline" 
            className="w-10 h-10 text-green-600 font-normal"
          />
      </div>

      {/* Success Message */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Order Successful!</h1>
        <p className="text-gray-600 text-sm">
          Your order is being processed, we&apos;ll notify you once it&apos;s about to be on its way...
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Number</span>
            <span className="text-sm font-medium text-gray-900">{orderNumber}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Payment Status</span>
            <span className="text-sm font-medium text-gray-900">{orderDetails.paymentStatus}</span>
          </div>
          
          {items.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Items</span>
              <span className="text-sm font-medium text-gray-900">{items.length}</span>
            </div>
          )}
          
          {orderDetails.subtotal !== undefined && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(orderDetails.subtotal)}</span>
              </div>
              
              {orderDetails.totalShippingCost !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Delivery Fee</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(orderDetails.totalShippingCost)}</span>
                </div>
              )}
              
              {orderDetails.totalTaxes !== undefined && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-900">{formatPrice(orderDetails.totalTaxes)}</span>
                </div>
              )}
            </>
          )}
          
          <div className="border-t border-[#E5E5E5] pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-900">Total Amount</span>
            <span className="text-lg font-bold text-gray-900">{formatPrice(totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {Object.keys(shippingAddress).length > 0 && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
          
          <div className="space-y-2 text-sm">
            <p className="text-gray-900">
              {shippingAddress.firstName} {shippingAddress.lastName}
            </p>
            <p className="text-gray-600">{shippingAddress.address}</p>
            <p className="text-gray-600">{shippingAddress.city}, {shippingAddress.state}</p>
            <p className="text-gray-600">{shippingAddress.country}</p>
            {shippingAddress.postalCode && (
              <p className="text-gray-600">{shippingAddress.postalCode}</p>
            )}
            <p className="text-gray-600 mt-2">{shippingAddress.phone}</p>
            <p className="text-gray-600">{shippingAddress.email}</p>
          </div>
        </div>
      )}

      {/* Items List */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg border border-[#E5E5E5] p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
          
          <div className="space-y-4">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-start pb-4 border-b border-[#E5E5E5] last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.productTitle || item.productName}</p>
                  {item.productBrand && (
                    <p className="text-xs text-gray-600 mt-1">Brand: {item.productBrand}</p>
                  )}
                  {item.productSize && (
                    <p className="text-xs text-gray-600">Size: {item.productSize}</p>
                  )}
                  <p className="text-xs text-gray-600 mt-1">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatPrice(item.itemTotal || item.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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