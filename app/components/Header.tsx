import { Menu } from 'lucide-react'
import Image from 'next/image'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '../components/Button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  doctorName: string
  clinicName: string
}

export function Header({ doctorName, clinicName }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      const result = await signIn('google', { callbackUrl: '/dashboard' })
      if (result?.error) {
        toast({
          title: 'Error',
          description: 'No se pudo iniciar sesión con Google',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar iniciar sesión',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar cerrar sesión',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center space-x-2">
        <Image
          alt="logo1.png"
          className="h-12 w-12 rounded-full"
          src="/images/logo1.png"
          width={50}
          height={50}
        />
        <div>
          <h2 className="text-sm font-medium">{doctorName}</h2>
          <p className="text-sm text-gray-500">{clinicName}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        {status === 'authenticated' ? (
          <Button variant="outline" onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Log out'}
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={() => signIn()}>
              Log In
            </Button>
            <Button variant="outline" onClick={handleGoogleSignUp} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Sign up'}
            </Button>
          </>
        )}
        <Button variant="outline" size="sm">
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
