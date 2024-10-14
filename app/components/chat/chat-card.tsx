'use client'

import { useState, useEffect } from 'react'
import { Button } from "../../components/Button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useSession } from 'next-auth/react'
import { sendMessage, getMessages } from '@/lib/api'

interface Message {
  id: string;
  senderId: string;
  content: string;
}

interface ChatCardProps {
  orderId: string;
  receiverId: string;
}

export default function ChatCard({ orderId, receiverId }: ChatCardProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
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

  const handleSend = async () => {
    console.log('handleSend called with message:', message);
    if (!message.trim()) return

    try {
      console.log('Attempting to send message');
      const response = await sendMessage(receiverId, orderId, message)
      console.log('sendMessage response:', response);
      setMessage('')
      fetchMessages()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="h-[200px] overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-2 rounded-lg mb-2 ${msg.senderId === session?.user?.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center space-x-2">
        <Input
          className="flex-grow"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              console.log('Enter key pressed');
              handleSend();
            }
          }}
        />
        <Button onClick={() => {
          console.log('Send button clicked');
          handleSend();
        }}>
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
