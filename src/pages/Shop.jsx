import { useState, useEffect } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'

const MOCK = [
  { id: 1, name: 'Bucket Hat',              price: 700,  category: 'hats',     description: 'Cozy handcrafted bucket hat in vibrant colors' },
  { id: 2, name: 'Crochet Bag',             price: 700,  category: 'bags',     description: 'Adorable round crochet shoulder bag, perfect for everyday' },
  { id: 3, name: 'Purple Flower Sweater',   price: 5000, category: 'sweaters', description: 'Stunning purple sweater with handmade white flower embellishments' },
  { id: 4, name: 'Colourful Sweater Pattern', price: 6000, category: 'sweaters', description: 'Vibrant multicolor patterned full sweater — a bold statement piece' },
  { id: 5, name: 'Purple Sweater',          price: 5500, category: 'sweaters', description: 'Classic cozy purple hand-knit sweater for all seasons' },
]

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')
  const [sort, setSort]         = useState('default')

  useEffect(() => {
    api.get('/products')
      .then(d => setProducts(Array.isArray(d) ? d : MOCK))
      .catch(() => setProducts(MOCK))
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  const visible = products
    .filter(p => filter === 'all' || p.category === filter)
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'name')       return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="shop-page">
      <div className="container">
        <div className="shop-header">
          <h1 className="section-title">Our Handcrafted Goodies</h1>
          <p className="section-sub">Each piece made with patience, love & yarn 🧶</p>

          <div className="filter-bar">
            {categories.map(c => (
              <button key={c} className={`filter-btn${filter === c ? ' active' : ''}`} onClick={() => setFilter(c)}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input"
              style={{ width: 'auto', padding: '8px 16px', borderRadius: 30, fontSize: 14 }}
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <span className="icon">🔍</span>
            <h3>No products found</h3>
            <p>Try a different category</p>
          </div>
        ) : (
          <div className="products-grid">
            {visible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
