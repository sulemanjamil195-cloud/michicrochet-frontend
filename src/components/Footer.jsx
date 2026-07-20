import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>MichiCrochet</h3>
          <p>Every piece is handcrafted with patience, love and warmth. Turning yarn into memories, one stitch at a time.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <button onClick={() => navigate('/shop')}>All Products</button>
          <button onClick={() => navigate('/custom-order')}>Custom Orders</button>
        </div>
        <div className="footer-col">
          <h4>Info</h4>
          <button onClick={() => navigate('/about')}>About Us</button>
          <button onClick={() => navigate('/orders')}>My Orders</button>
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <a href="mailto:hello@michicrochet.com">Email Us</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <p className="footer-bottom">© 2025 MichiCrochet • Handmade with 💗 in Pakistan</p>
    </footer>
  )
}
