'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
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
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isWorker, setIsWorker] = useState(false)

  useEffect(() => {
    async function checkWorkerStatus() {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/worker?email=${encodeURIComponent(session.user.email)}&checkWorkerStatus=true`)
          const data = await response.json()
          setIsWorker(data.isWorker)
        } catch (error) {
          console.error('Error checking worker status:', error)
        }
      }
    }

    checkWorkerStatus()
  }, [session])

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

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="p-4 flex items-center justify-between border-b">
      <div className="flex items-center space-x-2">
        <Link href="/">
          <Image
            alt="logo1.png"
            className="h-12 w-12 rounded-full cursor-pointer"
            src="/images/logo1.png"
            width={50}
            height={50}
          />
        </Link>
        <div>
          <h2 className="text-sm font-medium">{doctorName}</h2>
          <p className="text-sm text-gray-500">{clinicName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 relative" ref={menuRef}>
      {status === 'authenticated' && isWorker && (
          <Button
            variant="outline"
            size="sm"
            className="bg-[#724fff] hover:bg-[#6240e3] text-white border-none"
          >
            <Link href="/dashboard-worker" className="text-white hover:text-white">Jobs</Link>
          </Button>
        )}
        <div className="flex items-center border rounded-full p-1">
          <button 
            className="p-1 hover:bg-gray-100 rounded-full"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          <button 
            className="relative w-8 h-8 rounded-full overflow-hidden focus:outline-none"
            onClick={toggleMenu}
          >
            <Image
              src="/images/profile.png" // Reemplaza con la ruta de la imagen de perfil
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          </button>
        </div>
        {isMenuOpen && (
          <div 
            className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 top-full"
          >
            <div className="py-1">
              {status === 'authenticated' ? (
                <>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Home
                  </Link>
                  <Link href="/HomeDashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </Link>
                  {isWorker && (
                    <Link href="/dashboard-worker" className="block px-4 py-2 text-sm text-[#724fff] hover:bg-gray-100">
                      Jobs
                    </Link>
                  )}
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Account
                  </Link>
                  <Link href="/HomeDashboard" className="block px-4 py-2 text-sm text-[#724fff] hover:bg-gray-100">
                    Hire Service
                  </Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Join as a Cleaner
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {isLoading ? 'Cargando...' : 'Log out'}
                  </button>
                </>
              ) : (
                <>
                  <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Home
                  </Link>
                  <Link href="/hire-service" className="block px-4 py-2 text-sm text-[#724fff] hover:bg-gray-100">
                    Hire Service
                  </Link>
                  <Link href="/join-as-cleaner" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Join as a Cleaner
                  </Link>
                  <Button
                    onClick={handleSignIn}
                    className="w-full justify-start rounded-none px-4 py-2 text-sm font-normal"
                    variant="ghost"
                  >
                    Sign In 
                  </Button>
                  <Button
                    onClick={handleSignIn}
                    className="w-full justify-start rounded-none px-4 py-2 text-sm font-normal"
                    variant="ghost"
                  >
                    Sign Up 
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
