import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import toast from 'react-hot-toast';

export default function AdminAddProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'hat',
    imageUrl: '',
    stock: 1,
    isHotselling: false,
    type: 'premade'
  });
  const [submitting, setSubmitting] = useState(false);

  // Security Check: If not logged in or not an admin, block the page UI
  if (!user || !user.isAdmin) {
    return (
      <div className="section container empty-state">
        <span className="icon">🛑</span>
        <h3>Access Denied</h3>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      }, user.token);

      toast.success('Product successfully added!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section container">
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#fff', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'Fraunces' }}>✨ Add New Product</h2>
          <Link to="/admin/products" className="btn btn-sm btn-outline">View All Products</Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Product Name</label>
            <input className="input" type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. Cozy Pink Beanie" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label>Price (RS)</label>
              <input className="input" type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} placeholder="25.00" />
            </div>
            <div className="input-group">
              <label>Stock Quantity</label>
              <input className="input" type="number" name="stock" required value={formData.stock} onChange={handleChange} placeholder="10" />
            </div>
          </div>

          <div className="input-group">
            <label>Category</label>
            <select className="input" name="category" value={formData.category} onChange={handleChange}>
              <option value="hat">Hat</option>
              <option value="bag">Bag</option>
              <option value="sweater">Sweater</option>
            </select>
          </div>

          <div className="input-group">
            <label>Image URL (Cloudinary)</label>
            <input className="input" type="url" name="imageUrl" required value={formData.imageUrl} onChange={handleChange} placeholder="https://res.cloudinary.com/..." />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea className="input" name="description" required value={formData.description} onChange={handleChange} placeholder="A lovely handmade crochet item..." />
          </div>

          <div className="input-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
            <input type="checkbox" name="isHotselling" checked={formData.isHotselling} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
            <label style={{ margin: 0 }}>Mark as Hot-Selling item? 🔥</label>
          </div>

          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '2rem' }} disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
