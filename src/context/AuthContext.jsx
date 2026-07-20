import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api'

const AuthContext = createContext(null)
const STORAGE_KEY = 'michicrochet_user'

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return null
  }
}

// The backend's /auth/login and /auth/register only return a { token }.
// There is no GET /api/auth/me endpoint, so the frontend can't fetch the
// user's name/email/isAdmin directly. We decode the JWT for the id/exp,
// and detect admin status by calling an admin-only endpoint and checking
// whether it succeeds (200) or is forbidden (403).
async function detectIsAdmin(token) {
  try {
    await api.get('/orders', token)
    return true
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [ready, setReady] = useState(false)

  // Restore session on first load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) { setReady(true); return }
    try {
      const u = JSON.parse(stored)
      const decoded = u.token ? decodeJwt(u.token) : null
      if (decoded?.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(STORAGE_KEY)
        setReady(true)
        return
      }
      setUser(u)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setReady(true)
    }
  }, [])

  const persist = (u) => {
    setUser(u)
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    else localStorage.removeItem(STORAGE_KEY)
  }

  // data = { token } from the API. extra = { name?, email? } from the form,
  // since the backend's auth responses don't include them.
  const login = async (data, extra = {}) => {
    const token = data.token
    const decoded = token ? decodeJwt(token) : null
    let u = {
      token,
      id: decoded?.id,
      name: extra.name || '',
      email: extra.email || '',
      isAdmin: false,
    }
    persist(u)
    setShowAuth(false)

    // Figure out admin status in the background without blocking sign-in
    const isAdmin = await detectIsAdmin(token)
    u = { ...u, isAdmin }
    persist(u)
  }

  const logout = () => persist(null)

  const openAuth = (mode = 'login') => {
    setAuthMode(mode)
    setShowAuth(true)
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, showAuth, setShowAuth, authMode, setAuthMode, openAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
