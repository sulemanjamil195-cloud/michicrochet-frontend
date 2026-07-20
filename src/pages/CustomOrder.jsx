// import { useState } from 'react'
// import { useAuth } from '../context/AuthContext'
// import { api } from '../api'
// import toast from 'react-hot-toast'

// export default function CustomOrder() {
//   const { user, openAuth } = useAuth()
//   const [form, setForm]       = useState({ description: '', budget: '', timeline: '', colorPreference: '', size: '' })
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)

//   const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

//   const handleSubmit = async () => {
//     if (!user) { openAuth('login'); return }
//     if (!form.description) { toast.error('Please describe what you want.'); return }
//     setLoading(true)
//     try {
//       await api.post('/custom-orders', form, user.token)
//       setSuccess(true)
//       toast.success('Custom request sent! 🎉')
//     } catch (e) {
//       toast.error(e.message || 'Failed to send request. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #FDF0F3, #EEF8F8)', padding: '5rem 2rem' }}>
//       <div className="custom-inner">
//         <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//           <span style={{ fontSize: 52 }}>✨</span>
//           <h1 className="section-title" style={{ marginTop: 20, marginBottom: 12 }}>Custom Order Request</h1>
//           <p className="section-sub" style={{ fontSize: 16, lineHeight: 1.7 }}>
//             Tell us what you have in mind and we'll bring your crochet dream to life!
//           </p>
//         </div>

//         {success ? (
//           <div style={{ background: '#fff', borderRadius: 24, padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
//             <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🎉</span>
//             <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 10 }}>Request Sent!</h2>
//             <p style={{ color: 'var(--mid)', fontSize: 16, lineHeight: 1.7 }}>
//               We'll review your request and get back to you within 24–48 hours.
//               <br />Thanks for choosing MichiCrochet! 💕
//             </p>
//           </div>
//         ) : (
//           <div style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
//             <div className="input-group">
//               <label>Describe your dream piece *</label>
//               <textarea className="input" value={form.description} onChange={set('description')}
//                 placeholder="E.g. A soft pink bucket hat with sunflower details, medium size, for a 5-year-old girl..." />
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <div className="input-group">
//                 <label>Color Preference</label>
//                 <input className="input" value={form.colorPreference} onChange={set('colorPreference')} placeholder="e.g. pastel pink, navy blue" />
//               </div>
//               <div className="input-group">
//                 <label>Size / Dimensions</label>
//                 <input className="input" value={form.size} onChange={set('size')} placeholder="e.g. S/M/L, 30cm tall" />
//               </div>
//               <div className="input-group">
//                 <label>Budget (RS)</label>
//                 <input className="input" value={form.budget} onChange={set('budget')} placeholder="e.g. 2000" />
//               </div>
//               <div className="input-group">
//                 <label>Timeline</label>
//                 <input className="input" value={form.timeline} onChange={set('timeline')} placeholder="e.g. 2 weeks, urgent" />
//               </div>
//             </div>

//             {!user && (
//               <div style={{ background: '#FFF9E5', border: '1px solid #F5C842', borderRadius: 12, padding: '1rem', marginBottom: 20, fontSize: 14, color: '#92400E' }}>
//                 ⚠️ You need to be signed in to submit a custom request.
//               </div>
//             )}

//             <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading || !form.description}>
//               {loading ? 'Sending...' : !user ? 'Sign In to Send Request' : 'Send Custom Request →'}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

const CATEGORIES = ['hat', 'bag', 'sweater']
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function MyRequests({ user }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api.get('/custom-orders/me', user.token)
      .then(d => setRequests(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user.token])

  useEffect(() => { load() }, [load])

  if (loading) return <div className="loading" style={{ marginTop: 40 }}><div className="spinner" /></div>
  if (requests.length === 0) return null

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, marginBottom: 16 }}>My Custom Requests</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {requests.map(req => (
          <div className="order-card card" key={req.id}>
            <div className="order-top">
              <span className="order-id">Request #{req.id}</span>
              <span className={`tag tag-${req.status === 'cancelled' ? 'cancelled' : req.status === 'confirmed' ? 'completed' : 'pending'}`}>
                {req.status}
              </span>
            </div>
            <div className="order-items-list">
              <div className="order-item-row"><span>Category</span><span>{req.category}</span></div>
              <div className="order-item-row"><span>Size / Color</span><span>{req.size} · {req.color}</span></div>
              <div className="order-item-row"><span>Budget</span><span>RS: {Number(req.estimatedPrice || 0).toLocaleString()}</span></div>
            </div>
            {req.status === 'pending' && (
              <button
                className="btn btn-sm btn-outline"
                style={{ marginTop: 12 }}
                disabled={cancellingId === req.id}
                onClick={() => MyRequests.doCancel(req, user, setRequests)}
              >
                {cancellingId === req.id ? 'Cancelling...' : 'Cancel Request'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

MyRequests.doCancel = async (req, user, setRequests) => {
  try {
    const updated = await api.patch(`/custom-orders/${req.id}/cancel`, null, user.token)
    setRequests(prev => prev.map(r => r.id === req.id ? (updated.id ? updated : { ...r, status: 'cancelled' }) : r))
    toast.success('Request cancelled')
  } catch (e) {
    toast.error(e.message || 'Failed to cancel request')
  }
}

export default function CustomOrder() {
  const { user, openAuth } = useAuth()
  const [form, setForm] = useState({
    category: '',
    size: '',
    color: '',
    extraNotes: '',
    estimatedPrice: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess]  = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!user) { openAuth('login'); return }
    if (!form.category) { toast.error('Please select a category.'); return }
    if (!form.size)     { toast.error('Please select a size.'); return }
    if (!form.color)    { toast.error('Please enter a color.'); return }
    if (!form.estimatedPrice || isNaN(form.estimatedPrice)) {
      toast.error('Please enter a valid budget.'); return
    }
    setLoading(true)
    try {
      await api.post('/custom-orders', {
        category:       form.category,
        size:           form.size,
        color:          form.color,
        extraNotes:     form.extraNotes || null,
        estimatedPrice: Number(form.estimatedPrice)
      }, user.token)
      setSuccess(true)
      setRefreshKey(k => k + 1)
      setForm({ category: '', size: '', color: '', extraNotes: '', estimatedPrice: '' })
      toast.success('Custom request sent! 🎉')
    } catch (e) {
      toast.error(e.message || 'Failed to send. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #FDF0F3, #EEF8F8)', padding: '5rem 2rem' }}>
      <div className="custom-inner">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: 52 }}>✨</span>
          <h1 className="section-title" style={{ marginTop: 20, marginBottom: 12 }}>Custom Order Request</h1>
          <p className="section-sub" style={{ fontSize: 16, lineHeight: 1.7 }}>
            Tell us what you have in mind and we'll bring your crochet dream to life!
          </p>
        </div>

        {success ? (
          <div style={{ background: '#fff', borderRadius: 24, padding: '3rem', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
            <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>🎉</span>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, marginBottom: 10 }}>Request Sent!</h2>
            <p style={{ color: 'var(--mid)', fontSize: 16, lineHeight: 1.7 }}>
              We'll review your request and get back to you within 24–48 hours. Thanks for choosing MichiCrochet! 💕
            </p>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setSuccess(false)}>Send Another Request</button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>

            {/* Category */}
            <div className="input-group">
              <label>What would you like? *</label>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button"
                    onClick={() => setForm(f => ({ ...f, category: c }))}
                    style={{
                      padding: '10px 24px', borderRadius: 30, border: '2px solid',
                      borderColor: form.category === c ? 'var(--pink)' : 'var(--border)',
                      background: form.category === c ? 'var(--pink-light)' : '#fff',
                      color: form.category === c ? 'var(--pink)' : 'var(--mid)',
                      fontWeight: 600, fontSize: 14, cursor: 'pointer'
                    }}>
                    {c === 'hat' ? '🪣 Hat' : c === 'bag' ? '👜 Bag' : '🧥 Sweater'}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="input-group">
              <label>Size *</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {SIZES.map(s => (
                  <button key={s} type="button"
                    onClick={() => setForm(f => ({ ...f, size: s }))}
                    style={{
                      width: 52, height: 44, borderRadius: 10, border: '2px solid',
                      borderColor: form.size === s ? 'var(--pink)' : 'var(--border)',
                      background: form.size === s ? 'var(--pink-light)' : '#fff',
                      color: form.size === s ? 'var(--pink)' : 'var(--mid)',
                      fontWeight: 600, fontSize: 13, cursor: 'pointer'
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label>Color *</label>
                <input className="input" value={form.color} onChange={set('color')}
                  placeholder="e.g. pastel pink, navy blue" />
              </div>
              <div className="input-group">
                <label>Your Budget (RS) *</label>
                <input type="number" className="input" value={form.estimatedPrice}
                  onChange={set('estimatedPrice')} placeholder="e.g. 2000" min="0" />
              </div>
            </div>

            <div className="input-group">
              <label>Extra Notes</label>
              <textarea className="input" value={form.extraNotes} onChange={set('extraNotes')}
                placeholder="Any special details — patterns, occasion, gifting, etc." />
            </div>

            {!user && (
              <div style={{ background: '#FFF9E5', border: '1px solid #F5C842', borderRadius: 12, padding: '1rem', marginBottom: 20, fontSize: 14, color: '#92400E' }}>
                ⚠️ You need to be signed in to submit a custom request.
              </div>
            )}

            <button className="btn btn-primary btn-full" onClick={handleSubmit}
              disabled={loading || !form.category || !form.size || !form.color || !form.estimatedPrice}>
              {loading ? 'Sending...' : !user ? 'Sign In to Send Request' : 'Send Custom Request →'}
            </button>
          </div>
        )}

        {user && <MyRequests key={refreshKey} user={user} />}
      </div>
    </div>
  )
}
