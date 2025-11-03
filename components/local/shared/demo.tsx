"use client"

import React from 'react'
import { CustomButton, CustomInput } from '@/components/local/shared'

export default function ComponentDemo() {
  const handleSearch = () => {
    console.log('Search clicked')
  }

  const handleSubmit = () => {
    console.log('Submit clicked')
  }

  const handleSend = () => {
    console.log('Send clicked')
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">Component Demo</h1>
      
      {/* Input Variations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Input Components</h2>
        
        {/* Normal Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Normal Input</label>
          <CustomInput 
            placeholder="Enter your text here"
          />
        </div>

        {/* Input with Left Icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input with Left Icon (Search)</label>
          <CustomInput 
            placeholder="Search..."
            icon="material-symbols:search"
            iconPosition="left"
          />
        </div>

        {/* Input with Right Icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input with Right Icon (Email)</label>
          <CustomInput 
            placeholder="Enter your email"
            icon="material-symbols:mail-outline"
            iconPosition="right"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password Input</label>
          <CustomInput 
            placeholder="Enter your password"
            isPassword
          />
        </div>

        {/* Input with Embedded Button */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input with Embedded Button</label>
          <CustomInput 
            placeholder="Enter search term"
            button={{
              text: "Search",
              onClick: handleSearch,
              variant: "default",
              icon: "material-symbols:search"
            }}
          />
        </div>

        {/* Input with Button and Icon */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Input with Left Icon and Embedded Button</label>
          <CustomInput 
            placeholder="Type your message"
            icon="material-symbols:chat-outline"
            iconPosition="left"
            button={{
              text: "Send",
              onClick: handleSend,
              variant: "default",
              icon: "material-symbols:send"
            }}
          />
        </div>

        {/* Password with Button (Complex Example) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Password with Submit Button</label>
          <CustomInput 
            placeholder="Enter password"
            isPassword
            button={{
              text: "Submit",
              onClick: handleSubmit,
              variant: "default",
              loading: false
            }}
          />
        </div>
      </div>

      {/* Button Variations */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Button Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Normal Button */}
          <CustomButton>Normal Button</CustomButton>

          {/* Button with Left Icon */}
          <CustomButton icon="material-symbols:add" iconPosition="left">
            Add Item
          </CustomButton>

          {/* Button with Right Icon */}
          <CustomButton icon="material-symbols:arrow-forward" iconPosition="right">
            Next
          </CustomButton>

          {/* Loading Button */}
          <CustomButton loading loadingText="Processing...">
            Submit
          </CustomButton>

          {/* Different Variants */}
          <CustomButton variant="outline" icon="material-symbols:edit">
            Edit
          </CustomButton>

          <CustomButton variant="destructive" icon="material-symbols:delete">
            Delete
          </CustomButton>

          <CustomButton variant="ghost" icon="material-symbols:visibility">
            View
          </CustomButton>

          <CustomButton variant="secondary" icon="material-symbols:download">
            Download
          </CustomButton>
        </div>
      </div>
    </div>
  )
}