import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get('/orders', user.token)
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(e => toast.error(e.message || 'Failed to load orders'))
      .finally(() => setLoading(false))
  }, [user])

  if (!user || !user.isAdmin) {
    return (
      <div className="section container empty-state">
        <span className="icon">🛑</span>
        <h3>Access Denied</h3>
        <p>You must be an administrator to view this page.</p>
      </div>
    )
  }

  const updateStatus = async (order, status) => {
    setSavingId(order.id)
    try {
      const updated = await api.put(`/orders/${order.id}`, { status }, user.token)
      setOrders(prev => prev.map(o => o.id === order.id ? updated : o))
      toast.success(`Order #${order.id} marked ${status}`)
    } catch (e) {
      toast.error(e.message || 'Failed to update order')
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (order) => {
    if (!window.confirm(`Delete order #${order.id}? This can't be undone.`)) return
    try {
      await api.delete(`/orders/${order.id}`, user.token)
      setOrders(prev => prev.filter(o => o.id !== order.id))
      toast.success('Order deleted')
    } catch (e) {
      toast.error(e.message || 'Failed to delete order')
    }
  }

  return (
    <div className="section container">
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Fraunces' }}>📦 Manage Orders</h2>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <div className="order-card card" key={order.id}>
              <div className="order-top">
                <span className="order-id">Order #{order.id} — User #{order.userId}</span>
                <span className={`tag tag-${order.status === 'cancelled' ? 'cancelled' : (order.status === 'delivered' || order.status === 'confirmed') ? 'completed' : 'pending'}`}>
                  {order.status}
                </span>
              </div>
              <p className="order-date">
                {order.createdAt ? new Date(order.createdAt).toLocaleString('en-PK') : ''} · Type: {order.type}
              </p>
              <p className="order-total">RS: {Number(order.totalPrice || 0).toLocaleString()}</p>

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

              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <select
                  className="input"
                  style={{ width: 'auto', padding: '8px 14px' }}
                  value={order.status}
                  disabled={savingId === order.id}
                  onChange={e => updateStatus(order, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-sm" style={{ color: '#9F1239' }} onClick={() => remove(order)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
