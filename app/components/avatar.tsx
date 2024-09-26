import Image from 'next/image'
import { cn } from '@/lib/utils'
import React from 'react'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block rounded-full overflow-hidden bg-muted',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Avatar.displayName = 'Avatar'

interface AvatarImageProps extends React.ComponentPropsWithoutRef<typeof Image> {
  size?: 'sm' | 'md' | 'lg'
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ size = 'md', className, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        className={cn('object-cover w-full h-full', className)}
        {...props}
        layout="fill"
      />
    )
  }
)
AvatarImage.displayName = 'AvatarImage'

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center w-full h-full bg-muted text-muted-foreground font-medium',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
AvatarFallback.displayName = 'AvatarFallback'

export { Avatar, AvatarImage, AvatarFallback }