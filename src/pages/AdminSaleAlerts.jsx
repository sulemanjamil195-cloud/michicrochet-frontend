import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

export default function AdminSaleAlerts() {
  const { user } = useAuth()
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState('Sale — Michicrochet')
  const [message, setMessage] = useState('We are running a sale! Visit the shop to see the deals.')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) return
    api.get('/sale-alerts', user.token)
      .then(d => setSubscribers(Array.isArray(d) ? d : []))
      .catch(e => toast.error(e.message || 'Failed to load subscribers'))
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

  const removeSubscriber = async (sub) => {
    if (!window.confirm(`Remove ${sub.email} from the list?`)) return
    try {
      await api.delete(`/sale-alerts/${sub.id}`, user.token)
      setSubscribers(prev => prev.filter(s => s.id !== sub.id))
      toast.success('Subscriber removed')
    } catch (e) {
      toast.error(e.message || 'Failed to remove subscriber')
    }
  }

  const notifyAll = async () => {
    setSending(true)
    try {
      const res = await api.post('/sale-alerts/notify-sale', { subject, message }, user.token)
      toast.success(res.message || `Sent to ${res.sent || 0} subscribers`)
    } catch (e) {
      toast.error(e.message || 'Failed to send notification')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="section container">
      <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Fraunces' }}>🔔 Sale Alert Subscribers</h2>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Notify Everyone About a Sale</h3>
        <div className="input-group">
          <label>Subject</label>
          <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Message</label>
          <textarea className="input" value={message} onChange={e => setMessage(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={notifyAll} disabled={sending || subscribers.length === 0}>
          {sending ? 'Sending...' : `Send to ${subscribers.length} subscriber${subscribers.length === 1 ? '' : 's'}`}
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: 8 }}>Email</th>
                <th style={{ padding: 8 }}>Subscribed</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map(sub => (
                <tr key={sub.id}>
                  <td style={{ padding: 8 }}>{sub.email}</td>
                  <td style={{ padding: 8 }}>{sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('en-PK') : ''}</td>
                  <td style={{ padding: 8 }}>
                    <button className="btn btn-sm" style={{ color: '#9F1239' }} onClick={() => removeSubscriber(sub)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
