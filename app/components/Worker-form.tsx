'use client'

import { useState, useRef, FC, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '../components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Location } from './Location'
import { WorkerProfile } from '@/types/interfaces'

interface WorkerFormProps {
  existingData?: WorkerProfile | null;
}

export const WorkerForm: FC<WorkerFormProps> = ({ existingData }) => {
  const [phoneNumber, setPhoneNumber] = useState(existingData?.phoneNumber || '')
  const [location, setLocation] = useState(existingData?.location || '')
  const [bankName, setBankName] = useState(existingData?.bankName || '')
  const [accountHolder, setAccountHolder] = useState(existingData?.accountHolder || '')
  const [accountNumber, setAccountNumber] = useState(existingData?.accountNumber || '')
  const [profilePictureUrl, setProfilePictureUrl] = useState(existingData?.profilePicture || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  useEffect(() => {
    if (existingData) {
      setPhoneNumber(existingData.phoneNumber || '')
      setLocation(existingData.location || '')
      setBankName(existingData.bankName || '')
      setAccountHolder(existingData.accountHolder || '')
      setAccountNumber(existingData.accountNumber || '')
      setProfilePictureUrl(existingData.profilePicture || '')
    }
  }, [existingData]);

  const { data: session } = useSession()
  const [profilePicture, setProfilePicture] = useState<File | null>(null)

  const handleLocationClick = () => {
    setIsLocationDialogOpen(true)
  }

  const handleSelectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation)
    setIsLocationDialogOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validación básica
    if (!phoneNumber || !location || !bankName || !accountHolder || !accountNumber) {
      setError('Please fill in all required fields')
      return
    }

    const formData = new FormData()
    formData.append('phoneNumber', phoneNumber)
    formData.append('location', location)
    formData.append('bankName', bankName)
    formData.append('accountHolder', accountHolder)
    formData.append('accountNumber', accountNumber)
    if (profilePicture) {
      formData.append('profilePicture', profilePicture)
    }

    try {
      const response = await fetch('/api/worker', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register worker')
      }

      console.log('Worker registered successfully:', data.worker)
      setSuccess(true)
      setError(null)
      // Opcional: Limpiar el formulario después del éxito
      // clearForm()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
      setSuccess(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePicture(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setProfilePicture(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="md:w-1/2">
        <Image
          src="/images/logo1.png" // Replace with your actual image path
          alt="Cleaning community"
          width={600}
          height={600}
          objectFit="cover"
          className="w-full h-full"
        />
      </div>
      <div className="md:w-1/2 p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="block text-left">Name</Label>
            <Input id="name" value={session?.user?.name || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="block text-left">Email</Label>
            <Input id="email" value={session?.user?.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="block text-left">Phone Number</Label>
            <Input 
              id="phoneNumber" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="block text-left">Address</Label>
            <div className="flex space-x-2">
              <Input id="location" value={location} readOnly className="flex-grow" />
              <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" onClick={handleLocationClick}>Location</Button>
                </DialogTrigger>
                <DialogContent>
                  <Location 
                    onSelectLocation={handleSelectLocation} 
                    onConfirm={handleSelectLocation}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName" className="block text-left">Bank Name</Label>
            <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder" className="block text-left">Account Holder</Label>
            <Input id="accountHolder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="block text-left">Account Number</Label>
            <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePicture" className="block text-left">Profile Picture</Label>
            {profilePictureUrl && (
              <Image
                src={profilePictureUrl}
                alt="Profile Picture"
                width={100}
                height={100}
                className="mb-2 rounded-full"
              />
            )}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-gray-500">Please upload an image file (jpg, png, or gif).</p>
              <p className="text-blue-500 hover:underline">Choose file or drop here</p>
              {profilePicture && <p className="mt-2 text-green-500">{profilePicture.name} selected</p>}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="profilePicture"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            {existingData ? 'Update Profile' : 'Submit'}
          </Button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">Worker registered successfully!</p>}
      </div>
    </div>
  )
}