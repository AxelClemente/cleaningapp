'use client'

import { useState } from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { Button } from "@/components/Button"

interface CheckoutButtonProps {
  amount: string
}

export function CheckoutButton({ amount }: CheckoutButtonProps) {
  const [showPayPal, setShowPayPal] = useState(false)

  return (
    <div>
      {!showPayPal ? (
        <Button onClick={() => setShowPayPal(true)}>Pagar con PayPal</Button>
      ) : (
        <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! }}>
          <PayPalButtons
            createOrder={(_, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [{
                  amount: {
                    currency_code: 'USD', // or your preferred currency
                    value: amount
                  }
                }],
              })
            }}
            onApprove={(_, actions) => {
              return actions.order!.capture().then((details) => {
                const name = details.payer?.name?.given_name ?? 'Cliente'
                alert(`Pago completado por ${name}`)
              })
            }}
          />
        </PayPalScriptProvider>
      )}
    </div>
  )
}