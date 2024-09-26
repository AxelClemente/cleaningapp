'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '../components/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

export function WorkerForm() {
  const { data: session } = useSession()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [location, setLocation] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLocationClick = () => {
    console.log('Getting location...')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted')
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
        <h2 className="text-2xl font-bold mb-6">You're just one step away from becoming part of our community!</h2>
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
              <Button type="button" onClick={handleLocationClick}>Location</Button>
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
          <Button type="submit" className="w-full mt-4">Submit</Button>
        </form>
      </div>
    </div>
  )
}