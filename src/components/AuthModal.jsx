import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

export default function AuthModal() {
  const { showAuth, setShowAuth, authMode, setAuthMode, login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!showAuth) return null

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill in all required fields.'); return }
    if (authMode === 'register' && !form.name) { setError('Please enter your name.'); return }
    setLoading(true); setError('')
    try {
      const body = authMode === 'login'
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password }
      const data = await api.post(`/auth/${authMode}`, body)
      await login(data, { name: form.name, email: form.email })
      toast.success(authMode === 'login' ? 'Welcome back! 💕' : 'Account created! 🎉')
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (mode) => { setAuthMode(mode); setError('') }

  return (
    <>
      {/* Overlay — dark blurred background, SEPARATE from modal */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 298,
          animation: 'fadeIn .2s ease'
        }}
        onClick={() => setShowAuth(false)}
      />

      {/* Modal card — sits ABOVE the overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        zIndex: 299,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        pointerEvents: 'none'
      }}>
        <div className="auth-modal" style={{ pointerEvents: 'all' }}>
          <h2>{authMode === 'login' ? 'Welcome back! 💕' : 'Join MichiCrochet 🧶'}</h2>
          <p className="sub">{authMode === 'login' ? 'Sign in to your account' : 'Create your free account'}</p>

          <div className="tab-bar">
            <button className={`tab${authMode === 'login' ? ' active' : ''}`} onClick={() => switchMode('login')}>Sign In</button>
            <button className={`tab${authMode === 'register' ? ' active' : ''}`} onClick={() => switchMode('register')}>Register</button>
          </div>

          {authMode === 'register' && (
            <div className="input-group">
              <label>Full Name</label>
              <input className="input" placeholder="Your name" value={form.name} onChange={set('name')} />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="you@email.com" value={form.email} onChange={set('email')} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input" placeholder="••••••••" value={form.password} onChange={set('password')}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button className="btn btn-primary btn-full" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </div>
    </>
  )
}