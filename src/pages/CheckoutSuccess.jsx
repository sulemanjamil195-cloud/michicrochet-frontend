import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-md)', maxWidth: 480 }}>
        <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🎉</span>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 10 }}>Payment Successful!</h2>
        <p style={{ color: 'var(--mid)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          Thank you for your order! We're already getting your handmade goodies ready. 💕
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
      </div>
    </div>
  )
}
