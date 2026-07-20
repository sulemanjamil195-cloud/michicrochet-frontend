import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount, setCartOpen } = useCart()
  const { user, logout, openAuth } = useAuth()
  const navigate = useNavigate()
  const [adminOpen, setAdminOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <button className="nav-logo" onClick={() => navigate('/')}>MichiCrochet</button>

        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>About</NavLink>

          {user && (
            <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>My Orders</NavLink>
          )}

          <NavLink to="/custom-order" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Custom Order</NavLink>

          {/* This ensures ONLY logged-in admins can see this menu */}
          {user && user.isAdmin && (
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setAdminOpen(true)}
              onMouseLeave={() => setAdminOpen(false)}
            >
              <button
                className="nav-link"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setAdminOpen(o => !o)}
              >
                Admin ▾
              </button>
              {adminOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, background: '#fff',
                  borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 8,
                  display: 'flex', flexDirection: 'column', minWidth: 180, zIndex: 50
                }}>
                  <NavLink to="/admin/products" className="nav-link" style={{ padding: '8px 12px' }} onClick={() => setAdminOpen(false)}>Products</NavLink>
                  <NavLink to="/admin/add-product" className="nav-link" style={{ padding: '8px 12px' }} onClick={() => setAdminOpen(false)}>+ Add Product</NavLink>
                  <NavLink to="/admin/orders" className="nav-link" style={{ padding: '8px 12px' }} onClick={() => setAdminOpen(false)}>Orders</NavLink>
                  <NavLink to="/admin/custom-requests" className="nav-link" style={{ padding: '8px 12px' }} onClick={() => setAdminOpen(false)}>Custom Requests</NavLink>
                  <NavLink to="/admin/sale-alerts" className="nav-link" style={{ padding: '8px 12px' }} onClick={() => setAdminOpen(false)}>Sale Alerts</NavLink>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">Hi, {(user.name || user.email || 'there').split(/[ @]/)[0]}! 👋</span>
              <button className="nav-signout" onClick={logout}>Sign out</button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={() => openAuth('login')}>Sign In</button>
          )}
          <button className="nav-cart btn" onClick={() => setCartOpen(true)}>
            🛒
            {itemCount > 0 && <span className="nav-cart-count">{itemCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  )
}
