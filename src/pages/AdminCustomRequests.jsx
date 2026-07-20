import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'cancelled']

export default function AdminCustomRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get('/custom-orders', user.token)
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .catch(e => toast.error(e.message || 'Failed to load custom requests'))
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

  const updateStatus = async (req, status) => {
    setSavingId(req.id)
    try {
      const updated = await api.put(`/custom-orders/${req.id}`, { status }, user.token)
      setRequests(prev => prev.map(r => r.id === req.id ? updated : r))
      toast.success(`Request #${req.id} marked ${status}`)
    } catch (e) {
      toast.error(e.message || 'Failed to update request')
    } finally {
      setSavingId(null)
    }
  }

  const remove = async (req) => {
    if (!window.confirm(`Delete request #${req.id}? This can't be undone.`)) return
    try {
      await api.delete(`/custom-orders/${req.id}`, user.token)
      setRequests(prev => prev.filter(r => r.id !== req.id))
      toast.success('Request deleted')
    } catch (e) {
      toast.error(e.message || 'Failed to delete request')
    }
  }

  return (
    <div className="section container">
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Fraunces' }}>✨ Custom Requests</h2>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : requests.length === 0 ? (
        <p>No custom requests yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {requests.map(req => (
            <div className="order-card card" key={req.id}>
              <div className="order-top">
                <span className="order-id">Request #{req.id} — User #{req.userId}</span>
                <span className={`tag tag-${req.status === 'cancelled' ? 'cancelled' : req.status === 'confirmed' ? 'completed' : 'pending'}`}>
                  {req.status}
                </span>
              </div>
              <p className="order-date">
                {req.createdAt ? new Date(req.createdAt).toLocaleString('en-PK') : ''}
              </p>
              <div className="order-items-list">
                <div className="order-item-row"><span>Category</span><span>{req.category}</span></div>
                <div className="order-item-row"><span>Size</span><span>{req.size}</span></div>
                <div className="order-item-row"><span>Color</span><span>{req.color}</span></div>
                <div className="order-item-row"><span>Budget</span><span>RS: {Number(req.estimatedPrice || 0).toLocaleString()}</span></div>
                {req.extraNotes && <div className="order-item-row"><span>Notes</span><span>{req.extraNotes}</span></div>}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                <select
                  className="input"
                  style={{ width: 'auto', padding: '8px 14px' }}
                  value={req.status}
                  disabled={savingId === req.id}
                  onChange={e => updateStatus(req, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn btn-sm" style={{ color: '#9F1239' }} onClick={() => remove(req)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
