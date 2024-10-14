'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import ChatCard from '@/components/chat/chat-card'
import { Order } from '../types/interfaces' // Assuming you have this type defined

export default function MessagesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders()
    }
  }, [session])

  const fetchOrders = async () => {
    if (!session?.user?.id) return;
    try {
      const response = await fetch(`/api/orders?userId=${session.user.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Messages</h1>
      {orders.map((order) => (
        <div key={order.id} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Order: {order.id}</h2>
          <ChatCard 
            orderId={order.id} 
            receiverId={order.workerId || ''} // Assuming you have a workerId field, otherwise adjust accordingly
          />
        </div>
      ))}
    </div>
  )
}
