'use client'

import { useState } from 'react'
import { Button } from "../../components/Button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Image, Paperclip, Send } from "lucide-react"

interface ChatCardProps {
  username: string;
}

export default function ChatCard({ username }: ChatCardProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    console.log('Sending message:', message)
    setMessage('')
    // Here you would typically send the message to your backend or update your chat state
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        {/* Chat messages would go here */}
        <div className="h-[50px] overflow-y-auto mb-4">
          {/* Example message */}
          <div className="bg-muted p-2 rounded-lg mb-2">
            <p className="text-sm">
              Do you want to send a message to{' '}
              <span className="font-semibold text-blue-600">{username}</span>?
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2">
        <div className="flex w-full items-center space-x-2">
          <Button variant="ghost" className="shrink-0">
            <Image className="h-5 w-5" />
            <span className="sr-only">Attach image</span>
          </Button>
          <Button variant="ghost" className="shrink-0">
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Input
            placeholder="Check this paradise"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSend} size="icon" className="shrink-0">
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
