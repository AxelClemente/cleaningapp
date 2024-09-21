import { CheckoutButton } from '@/components/Checkout-button'

export default function CheckoutPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <CheckoutButton amount="10.00" />
    </div>
  )
}