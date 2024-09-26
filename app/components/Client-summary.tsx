'use client'

import { Button } from "../components/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar"

interface Reservation {
  id: string
  guestName: string
  dates: string
  propertyInfo: string
  avatarUrl: string
}

interface Refund {
  id: string
  guestName: string
  dates: string
  avatarUrl: string
}

interface ClientSummaryProps {
  clientName: string
  reservations: Reservation[]
  refunds: Refund[]
}

export function ClientSummary({ clientName, reservations, refunds }: ClientSummaryProps) {
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
                  <AvatarImage src={reservation.avatarUrl} alt={reservation.guestName} />
                  <AvatarFallback>{reservation.guestName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{reservation.guestName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{reservation.dates}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reservation.propertyInfo}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Message</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Records</h2>
          <Button variant="link">Historical data ({refunds.length})</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {refunds.map((refund) => (
            <Card key={refund.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={refund.avatarUrl} alt={refund.guestName} />
                  <AvatarFallback>{refund.guestName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{refund.guestName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{refund.dates}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">Completed</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Receipt</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}