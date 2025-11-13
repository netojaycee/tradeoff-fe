"use client"

import * as React from "react"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon } from "@iconify/react"

interface CustomButtonProps 
  extends React.ComponentProps<typeof ShadcnButton>,
    VariantProps<typeof buttonVariants> {
  /**
   * Icon to display (using Iconify)
   */
  icon?: string
  /**
   * Position of the icon
   */
  iconPosition?: "left" | "right"
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Loading text to display when loading
   */
  loadingText?: string
  /**
   * Custom icon size
   */
  iconSize?: string | number
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ 
    className, 
    children, 
    icon, 
    iconPosition = "left", 
    loading = false, 
    loadingText, 
    iconSize = "1rem",
    disabled,
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading

    const renderIcon = (iconName: string, position: "left" | "right") => (
      <Icon 
        icon={iconName} 
        style={{ 
          fontSize: iconSize,
          ...(position === "left" && children && { marginRight: "0.1rem" }),
          ...(position === "right" && children && { marginLeft: "0.1rem" })
        }}
      />
    )

    const renderLoadingIcon = () => (
      <Icon 
        icon="lucide:loader-2" 
        className="animate-spin"
        style={{ 
          fontSize: iconSize,
          ...(loadingText && { marginRight: "0.5rem" })
        }}
      />
    )

    return (
      <ShadcnButton
        ref={ref}
        className={cn(className, "rounded cursor-pointer")}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            {renderLoadingIcon()}
            {loadingText || children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && renderIcon(icon, "left")}
            {children}
            {icon && iconPosition === "right" && renderIcon(icon, "right")}
          </>
        )}
      </ShadcnButton>
    )
  }
)

CustomButton.displayName = "CustomButton"

export { CustomButton, type CustomButtonProps }