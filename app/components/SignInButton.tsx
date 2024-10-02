'use client'

import { useRouter } from 'next/navigation'
import { Button } from './Button' // Asegúrate de que la ruta de importación sea correcta
import { signIn } from 'next-auth/react'

export function SignInButton() {
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      const result = await signIn('google', { callbackUrl: '/dashboard' })
      console.log('SignIn result:', result)
      if (result?.error) {
        console.error('SignIn error:', result.error)
      }
    } catch (error) {
      console.error('SignIn error:', error)
    }
  }

  return (
    <Button 
      onClick={handleSignIn}
      className="px-6 py-3 bg-black text-white rounded-md hover:bg-[rgb(245,179,129)] transition-colors"
    >
      Sign up
    </Button>
  )
}