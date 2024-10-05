import * as React from "react"
import { cn } from "@/lib/utils"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, type = "text", value, ...props }, ref) => {
    console.log("CustomInput value:", value); // Verifica que el valor esté pasando correctamente
    
    return (
      <input
        type={type}
        className={cn(
          "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          className
        )}
        value={value} // Asegúrate de que este 'value' esté siempre actualizado
        ref={ref}
        {...props}
      />
    )
  }
)

CustomInput.displayName = "CustomInput"

export { CustomInput }