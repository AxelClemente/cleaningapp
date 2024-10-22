'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "../Button"
import { Input } from "@/components/ui/input"
import { useSession } from 'next-auth/react'
import { sendMessage, getMessages } from '@/lib/api'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
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
  const [workerUserId, setWorkerUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isWorker, setIsWorker] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerUserId = async () => {
      try {
        const response = await fetch(`/api/worker?workerId=${workerId}`);
        if (response.ok) {
          const data = await response.json();
          setWorkerUserId(data.userId);
          if (session?.user?.id) {
            setIsWorker(session.user.id === data.userId);
          }
        }
      } catch (error) {
        console.error('Error fetching worker user ID:', error);
      }
    };
    if (session?.user?.id) {
      fetchWorkerUserId();
    }
  }, [workerId, session]);

  const fetchMessages = async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      console.log('Fetching messages for orderId:', orderId);
      const fetchedMessages = await getMessages(orderId);
      console.log('Fetched messages:', fetchedMessages);
      setMessages(Array.isArray(fetchedMessages) ? fetchedMessages : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && orderId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId, status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?.user?.id) return;

    const receiverId = isWorker ? clientId : workerId;

    try {
      console.log('Attempting to send message', { receiverId, orderId, content: newMessage });
      const response = await sendMessage(receiverId, orderId, newMessage);
      console.log('sendMessage response:', response);
      setNewMessage('');
      fetchMessages();
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
        {isLoading ? (
          <div>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div>No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-2 rounded-lg ${message.senderId === session.user.id ? 'bg-blue-500 text-white' : 'bg-white'}`}>
                {message.content}
              </div>
            </div>
          ))
        )}
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
