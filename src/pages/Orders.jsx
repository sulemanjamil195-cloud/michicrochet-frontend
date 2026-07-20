// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import { api } from '../api'

// const statusClass = s => {
//   if (!s) return 'tag tag-pending'
//   const l = s.toLowerCase()
//   if (l === 'delivered' || l === 'completed') return 'tag tag-completed'
//   if (l === 'cancelled') return 'tag tag-cancelled'
//   if (l === 'processing') return 'tag tag-processing'
//   return 'tag tag-pending'
// }

// export default function Orders() {
//   const { user, openAuth } = useAuth()
//   const navigate = useNavigate()
//   const [orders, setOrders]   = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     if (!user) { setLoading(false); return }
//     api.get('/orders', user.token)
//       .then(d => setOrders(Array.isArray(d) ? d : []))
//       .catch(() => setOrders([]))
//       .finally(() => setLoading(false))
//   }, [user])

//   if (!user) return (
//     <div className="orders-page">
//       <div className="orders-inner">
//         <div className="empty-state">
//           <span className="icon">🔒</span>
//           <h3>Sign in to view your orders</h3>
//           <p>Track your handmade goodies right here.</p>
//           <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => openAuth('login')}>Sign In</button>
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="orders-page">
//       <div className="orders-inner">
//         <h1>My Orders 📦</h1>

//         {loading ? (
//           <div className="loading"><div className="spinner" /></div>
//         ) : orders.length === 0 ? (
//           <div className="empty-state">
//             <span className="icon">📭</span>
//             <h3>No orders yet</h3>
//             <p>Time to treat yourself!</p>
//             <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>Shop Now</button>
//           </div>
//         ) : (
//           orders.map(order => (
//             <div className="order-card card" key={order.id}>
//               <div className="order-top">
//                 <span className="order-id">Order #{order.id}</span>
//                 <span className={statusClass(order.status)}>{order.status || 'Pending'}</span>
//               </div>
//               <p className="order-date">
//                 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
//               </p>
//               <p className="order-total">RS: {(order.total || order.totalAmount || 0).toLocaleString()}</p>

//               {order.orderItems?.length > 0 && (
//                 <div className="order-items-list">
//                   {order.orderItems.map(item => (
//                     <div className="order-item-row" key={item.id}>
//                       <span>{item.product?.name || `Product #${item.productId}`} × {item.quantity}</span>
//                       <span>RS: {((item.price || 0) * item.quantity).toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'

const statusClass = s => {
  if (!s) return 'tag tag-pending'
  const l = s.toLowerCase()
  if (l === 'confirmed' || l === 'delivered' || l === 'completed') return 'tag tag-completed'
  if (l === 'cancelled') return 'tag tag-cancelled'
  if (l === 'processing') return 'tag tag-processing'
  return 'tag tag-pending'
}

export default function Orders() {
  const { user, openAuth } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!user) { setLoading(false); return }
    api.get('/orders/me', user.token)
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(e => setError(e.message || 'Could not load orders.'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return (
    <div className="orders-page">
      <div className="orders-inner">
        <div className="empty-state">
          <span className="icon">🔒</span>
          <h3>Sign in to view your orders</h3>
          <p>Track your handmade goodies right here.</p>
          <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => openAuth('login')}>Sign In</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="orders-page">
      <div className="orders-inner">
        <h1>My Orders 📦</h1>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : error ? (
          <div style={{ background: '#FFF1F2', borderRadius: 14, padding: '1.5rem', color: '#9F1239', fontSize: 15 }}>
            ⚠️ {error}
            <br /><br />
            <strong>Note:</strong> Make sure the backend has a <code>GET /api/orders/me</code> route. See the fix below.
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📭</span>
            <h3>No orders yet</h3>
            <p>Time to treat yourself!</p>
            <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => navigate('/shop')}>Shop Now</button>
          </div>
        ) : orders.map(order => (
          <div className="order-card card" key={order.id}>
            <div className="order-top">
              <span className="order-id">Order #{order.id}</span>
              <span className={statusClass(order.status)}>{order.status || 'Pending'}</span>
            </div>
            <p className="order-date">
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
            </p>
            <p className="order-total">RS: {(order.totalPrice || order.total || 0).toLocaleString()}</p>
            {order.orderItems?.length > 0 && (
              <div className="order-items-list">
                {order.orderItems.map(item => (
                  <div className="order-item-row" key={item.id}>
                    <span>{item.product?.name || `Product #${item.productId}`} × {item.quantity}</span>
                    <span>RS: {((item.price || 0) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
