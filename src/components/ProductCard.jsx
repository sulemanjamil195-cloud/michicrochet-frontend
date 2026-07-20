import { useState } from 'react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const CATEGORY_BG   = { hats: '#FFE5EC', bags: '#E5F5E5', sweaters: '#FFF0E5', default: '#F0EFFF' }
const CATEGORY_EMOJI = { hats: '🪣', bags: '👜', sweaters: '🧥', default: '🧶' }

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    toast.success(`${product.name} added to cart!`)
    setTimeout(() => setAdded(false), 1800)
  }

  const cat = product.category || 'default'
  const bg  = CATEGORY_BG[cat]   || CATEGORY_BG.default
  const em  = CATEGORY_EMOJI[cat] || CATEGORY_EMOJI.default

  return (
    <div className="product-card card card-hover">
      <div className="product-img" style={{ background: bg }}>
        {product.imageUrl || product.image
          ? <img src={product.imageUrl || product.image} alt={product.name} />
          : <span className="emoji-placeholder">{em}</span>
        }
      </div>
      <div className="product-body">
        <p className="product-name">{product.name}</p>
        <p className="product-desc">{product.description || ''}</p>
        <div className="product-footer">
          <span className="product-price">RS: {(product.price || 0).toLocaleString()}</span>
          <button
            className={`add-to-cart${added ? ' added' : ''}`}
            onClick={handleAdd}
          >
            {added ? '✓ Added!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
