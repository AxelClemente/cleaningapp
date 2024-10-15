'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { useSession } from 'next-auth/react'
import { sendMessage, getMessages } from '@/lib/api'

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
}

interface ChatCardProps {
  orderId: string;
  receiverId: string;
}

export default function ChatCard({ orderId, receiverId }: ChatCardProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const { data: session } = useSession()

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?orderId=${orderId}`);
      if (response.ok) {
        const fetchedMessages = await response.json();
        setMessages(fetchedMessages);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    if (!newMessage.trim()) return;

    try {
      console.log('Attempting to send message');
      const response = await sendMessage(receiverId, orderId, newMessage);
      console.log('sendMessage response:', response);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-[300px] border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.senderId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                message.senderId === session?.user?.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
}
