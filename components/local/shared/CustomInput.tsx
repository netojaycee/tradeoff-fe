"use client"

import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { CustomButton } from "./CustomButton"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

interface CustomInputProps extends React.ComponentProps<typeof ShadcnInput> {
  /**
   * Icon to display (using Iconify)
   */
  icon?: string
  /**
   * Position of the icon
   */
  iconPosition?: "left" | "right"
  /**
   * Custom icon size
   */
  iconSize?: string | number
  /**
   * Makes the icon clickable
   */
  onIconClick?: () => void
  /**
   * Password input with toggle visibility
   */
  isPassword?: boolean
  /**
   * Button to embed inside the input (right side)
   */
  button?: {
    text: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"
    icon?: string
    loading?: boolean
    loadingText?: string
    disabled?: boolean
  }
  /**
   * Container wrapper class
   */
  wrapperClassName?: string
  /**
   * Icon wrapper class
   */
  iconClassName?: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ 
    className,
    wrapperClassName,
    iconClassName,
    icon, 
    iconPosition = "right", 
    iconSize = "1rem", 
    onIconClick,
    isPassword = false,
    button,
    type: propType,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [inputType, setInputType] = React.useState(propType)

    // Handle password visibility toggle
    React.useEffect(() => {
      if (isPassword) {
        setInputType(showPassword ? "text" : "password")
      } else {
        setInputType(propType)
      }
    }, [isPassword, showPassword, propType])

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    // Determine padding based on icons and button
    const getPadding = () => {
      let leftPadding = ""
      let rightPadding = ""

      // Left padding for left icon
      if (icon && iconPosition === "left") {
        leftPadding = "pl-10"
      }

      // Right padding for right icon, password toggle, or button
      if (
        (icon && iconPosition === "right") || 
        isPassword || 
        button
      ) {
        rightPadding = button ? "pr-20" : "pr-10"
      }

      return cn(leftPadding, rightPadding)
    }

    const renderIcon = (iconName: string, position: "left" | "right") => {
      const iconElement = (
        <Icon 
          icon={iconName}
          style={{ fontSize: iconSize }}
          className={cn(
            "text-gray-400 transition-colors",
            onIconClick && "hover:text-gray-600 cursor-pointer",
            iconClassName
          )}
          onClick={onIconClick}
        />
      )

      return (
        <div 
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2",
            position === "left" ? "left-3" : "right-3"
          )}
        >
          {iconElement}
        </div>
      )
    }

    const renderPasswordToggle = () => (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <Icon 
          icon={showPassword ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline"}
          style={{ fontSize: iconSize }}
        />
      </button>
    )

    const renderButton = () => {
      if (!button) return null

      return (
        <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
          <CustomButton
            size={button.size || "sm"}
            variant={button.variant || "default"}
            onClick={button.onClick}
            icon={button.icon}
            loading={button.loading}
            loadingText={button.loadingText}
            disabled={button.disabled}
            className="h-7"
          >
            {button.text}
          </CustomButton>
        </div>
      )
    }

    return (
      <div className={cn("relative", wrapperClassName)}>
        <ShadcnInput
          ref={ref}
          type={inputType}
          className={cn(
            getPadding(),
            className
          )}
          {...props}
        />
        
        {/* Left Icon */}
        {icon && iconPosition === "left" && renderIcon(icon, "left")}
        
        {/* Right Icon (not password and not button) */}
        {icon && iconPosition === "right" && !isPassword && !button && renderIcon(icon, "right")}
        
        {/* Password Toggle */}
        {isPassword && !button && renderPasswordToggle()}
        
        {/* Embedded Button */}
        {button && renderButton()}
        
        {/* Password toggle with button (password takes precedence, button moves left) */}
        {isPassword && button && (
          <>
            <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
              <CustomButton
                size={button.size || "sm"}
                variant={button.variant || "default"}
                onClick={button.onClick}
                icon={button.icon}
                loading={button.loading}
                loadingText={button.loadingText}
                disabled={button.disabled}
                className="h-7"
              >
                {button.text}
              </CustomButton>
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon 
                icon={showPassword ? "material-symbols:visibility-off-outline" : "material-symbols:visibility-outline"}
                style={{ fontSize: iconSize }}
              />
            </button>
          </>
        )}
      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"

export { CustomInput, type CustomInputProps }