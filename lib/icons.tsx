/**
 * Icon utility component for Hugeicons
 * Provides a consistent interface for using Hugeicons throughout the app
 */
import { HugeiconsIcon } from '@hugeicons/react'
import type { ComponentProps } from 'react'

type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, 'icon'> & {
  icon: ComponentProps<typeof HugeiconsIcon>['icon']
  size?: number
  color?: string
  strokeWidth?: number
}

export function Icon({ size = 20, color = 'currentColor', strokeWidth = 1.75, ...props }: IconProps) {
  return (
    <HugeiconsIcon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...props}
    />
  )
}

// Re-export HugeiconsIcon for direct use when needed
export { HugeiconsIcon }



