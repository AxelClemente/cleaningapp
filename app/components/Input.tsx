import * as React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps) {
  return <input className="w-full px-3 py-2 border rounded-md" {...props} />
}