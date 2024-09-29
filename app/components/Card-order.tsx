'use client'

import { Button } from "./Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./avatar"
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Reservation {
  id: string;
  userName: string;
  calendarData: string;
  houseType: string;
  price: number;
  status: string;
  avatarUrl: string;
  serviceType: string;
  location: string;
}

interface ClientSummaryProps {
  clientName: string
}

export function ClientSummary({ clientName }: ClientSummaryProps) {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    const fetchReservations = async () => {
      if (session?.user?.email) {
        const response = await fetch(`/api/orders?email=${session.user.email}`)
        if (response.ok) {
          const data = await response.json()
          console.log('Reservations data:', data) // Añade esta línea
          setReservations(data)
        }
      }
    }
    fetchReservations()
  }, [session])

  return (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tus reservas</h2>
          <Button variant="link">All reservations ({reservations.length})</Button>
        </div>
        <Button variant="outline" className="mb-4">In progress ({reservations.length})</Button>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reservations.map((reservation) => (
            <Card key={reservation.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={reservation.avatarUrl} alt={reservation.userName} />
                  <AvatarFallback>{reservation.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{reservation.userName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{reservation.calendarData}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reservation.houseType}</p>
                <p className="text-sm">Service: {reservation.serviceType}</p>
                <p className="text-sm">Location: {reservation.location}</p>
                <p className="text-sm font-medium mt-2">Price: €{reservation.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">{reservation.status}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}