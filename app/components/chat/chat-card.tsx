'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { useSession } from 'next-auth/react'
import { sendMessage, getMessages } from '@/lib/api'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  sender?: {
    image?: string;
    name?: string;
  };
}

interface ChatCardProps {
  orderId: string;
  workerId: string;
  clientId: string;
}

export default function ChatCard({ orderId, workerId, clientId }: ChatCardProps) {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const fetchedMessages = await getMessages(orderId);
      setMessages(prevMessages => {
        // Comparar los mensajes nuevos con los existentes
        if (JSON.stringify(prevMessages) !== JSON.stringify(fetchedMessages)) {
          return fetchedMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && orderId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 6000);
      return () => clearInterval(interval);
    }
  }, [orderId, status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.id) return;

    const receiverId = session.user.id === workerId ? clientId : workerId;

    try {
      await sendMessage(receiverId, orderId, newMessage);
      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (status !== 'authenticated') {
    return <div>Please sign in to use the chat.</div>;
  }

  return (
    <div className="flex flex-col h-[300px] border rounded-lg overflow-hidden bg-[#edecf2]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-2 rounded-lg ${message.senderId === session.user.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-white">
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
