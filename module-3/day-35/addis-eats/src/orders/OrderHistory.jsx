import { useAuth } from '../auth/useAuth'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'
import OrderHistoryItem from './OrderHistoryItem'
import { useOrderStore } from './orderHistoryStore'
import './orders.css'

// Feature 16: the signed-in customer's past orders, newest first.
export default function OrderHistory() {
  useDocumentTitle('Your orders')
  const { user } = useAuth()
  const allOrders = useOrderStore((s) => s.orders)
  const orders = allOrders.filter((order) => order.userPhone === user.phone)

  return (
    <div className="container page page--narrow">
      <div className="page-head">
        <h1>Your orders</h1>
        <p>Every order you have placed, with one-tap reorder.</p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="You haven't ordered yet"
          actions={<Button to="/menu">Start your first order</Button>}
        >
          Your past orders will appear here, ready to reorder.
        </EmptyState>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <OrderHistoryItem key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  )
}
