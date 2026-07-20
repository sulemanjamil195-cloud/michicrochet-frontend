import { useNavigate } from 'react-router-dom'

export default function CheckoutCancel() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-md)', maxWidth: 480 }}>
        <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>😿</span>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 10 }}>Checkout Cancelled</h2>
        <p style={{ color: 'var(--mid)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          No worries — your cart items are still saved. You can checkout whenever you're ready.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    </div>
  )
}
