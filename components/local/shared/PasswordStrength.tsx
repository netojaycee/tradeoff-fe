"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { Icon } from '@iconify/react'

interface PasswordStrengthProps {
  password: string
  className?: string
}

interface StrengthLevel {
  level: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong'
  text: string
  color: string
  barColor: string
  segments: number
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({
  password,
  className
}) => {
  const calculateStrength = (password: string): StrengthLevel => {
    if (!password) {
      return {
        level: 'very-weak',
        text: '',
        color: '',
        barColor: '',
        segments: 0
      }
    }

    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    // Determine strength level
    if (score <= 2) {
      return {
        level: 'very-weak',
        text: 'Very weak',
        color: 'text-red-500',
        barColor: 'bg-red-500',
        segments: 1
      }
    } else if (score === 3) {
      return {
        level: 'weak',
        text: 'Weak',
        color: 'text-orange-500',
        barColor: 'bg-orange-500',
        segments: 2
      }
    } else if (score === 4) {
      return {
        level: 'fair',
        text: 'Fair',
        color: 'text-yellow-500',
        barColor: 'bg-yellow-500',
        segments: 2
      }
    } else if (score === 5) {
      return {
        level: 'good',
        text: 'Good',
        color: 'text-green-500',
        barColor: 'bg-green-500',
        segments: 3
      }
    } else {
      return {
        level: 'strong',
        text: 'Strong',
        color: 'text-green-600',
        barColor: 'bg-green-600',
        segments: 4
      }
    }
  }

  const strength = calculateStrength(password)

  if (!password) return null

  return (
    <div className={cn("mt-2", className)}>
      {/* Strength bars */}
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-200",
              segment <= strength.segments
                ? strength.barColor
                : "bg-gray-200"
            )}
          />
        ))}
      </div>
      
      {/* Strength text with icon */}
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-medium", strength.color)}>
          {strength.text}
        </span>
        <Icon 
          icon="material-symbols:info-outline" 
          className="h-4 w-4 text-gray-400"
        />
      </div>
    </div>
  )
}

export { PasswordStrength, type PasswordStrengthProps }