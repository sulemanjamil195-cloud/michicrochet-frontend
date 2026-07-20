import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import toast from 'react-hot-toast'

const CATEGORIES = ['hat', 'bag', 'sweater']

function EditRow({ product, token, onSaved, onDeleted }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    imageUrl: product.imageUrl,
    stock: product.stock,
    isHotselling: product.isHotselling,
    type: product.type,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const change = (field) => (e) => {
    const { type, checked, value } = e.target
    setForm(f => ({ ...f, [field]: type === 'checkbox' ? checked : value }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const updated = await api.put(`/products/${product.id}`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
      }, token)
      toast.success('Product updated')
      setEditing(false)
      onSaved(updated)
    } catch (e) {
      toast.error(e.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return
    setDeleting(true)
    try {
      await api.delete(`/products/${product.id}`, token)
      toast.success('Product deleted')
      onDeleted(product.id)
    } catch (e) {
      toast.error(e.message || 'Failed to delete product')
      setDeleting(false)
    }
  }

  if (!editing) {
    return (
      <tr>
        <td>{product.imageUrl ? <img src={product.imageUrl} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }} /> : '—'}</td>
        <td>{product.name}</td>
        <td>{product.category}</td>
        <td>RS: {Number(product.price || 0).toLocaleString()}</td>
        <td>{product.stock}</td>
        <td>{product.isHotselling ? '🔥' : ''}</td>
        <td style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm btn-outline" onClick={() => setEditing(true)}>Edit</button>
          <button className="btn btn-sm" style={{ color: '#9F1239' }} onClick={remove} disabled={deleting}>
            {deleting ? '...' : 'Delete'}
          </button>
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td colSpan={7}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 10, padding: '10px 0', alignItems: 'end' }}>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Name</label>
            <input className="input" value={form.name} onChange={change('name')} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Category</label>
            <select className="input" value={form.category} onChange={change('category')}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Price</label>
            <input type="number" className="input" value={form.price} onChange={change('price')} />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label>Stock</label>
            <input type="number" className="input" value={form.stock} onChange={change('stock')} />
          </div>
          <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
            <label>Image URL</label>
            <input className="input" value={form.imageUrl} onChange={change('imageUrl')} />
          </div>
          <div className="input-group" style={{ marginBottom: 0, gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea className="input" value={form.description} onChange={change('description')} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={!!form.isHotselling} onChange={change('isHotselling')} />
            <label style={{ margin: 0 }}>Hot-selling 🔥</label>
          </div>
          <div style={{ display: 'flex', gap: 8, gridColumn: '1 / -1' }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            <button className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </div>
      </td>
    </tr>
  )
}

export default function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/products')
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  if (!user || !user.isAdmin) {
    return (
      <div className="section container empty-state">
        <span className="icon">🛑</span>
        <h3>Access Denied</h3>
        <p>You must be an administrator to view this page.</p>
      </div>
    )
  }

  return (
    <div className="section container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ margin: 0, fontFamily: 'Fraunces' }}>🧶 Manage Products</h2>
        <Link to="/admin/add-product" className="btn btn-primary btn-sm">+ Add Product</Link>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : products.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: 8 }}>Image</th>
                <th style={{ padding: 8 }}>Name</th>
                <th style={{ padding: 8 }}>Category</th>
                <th style={{ padding: 8 }}>Price</th>
                <th style={{ padding: 8 }}>Stock</th>
                <th style={{ padding: 8 }}>Hot</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <EditRow
                  key={p.id}
                  product={p}
                  token={user.token}
                  onSaved={(updated) => setProducts(prev => prev.map(x => x.id === updated.id ? updated : x))}
                  onDeleted={(id) => setProducts(prev => prev.filter(x => x.id !== id))}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
