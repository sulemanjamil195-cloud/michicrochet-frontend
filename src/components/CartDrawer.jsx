// import { useCart } from '../context/CartContext'
// import { useAuth } from '../context/AuthContext'
// import { api } from '../api'
// import { useState } from 'react'
// import toast from 'react-hot-toast'

// const CATEGORY_BG   = { hats: '#FFE5EC', bags: '#E5F5E5', sweaters: '#FFF0E5', default: '#F0EFFF' }
// const CATEGORY_EMOJI = { hats: '🪣', bags: '👜', sweaters: '🧥', default: '🧶' }

// export default function CartDrawer() {
//   const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, total, clearCart } = useCart()
//   const { user, openAuth } = useAuth()
//   const [loading, setLoading] = useState(false)

//   if (!cartOpen) return null

//   const handleCheckout = async () => {
//     if (!user) {
//       setCartOpen(false)
//       openAuth('login')
//       return
//     }
//     setLoading(true)
//     try {
//       const items = cart.map(i => ({ productId: i.product.id, quantity: i.qty }))
//       const data = await api.post('/checkout', { items }, user.token)
//       const url = data.url || data.sessionUrl
//       if (url) {
//         window.location.href = url
//       } else {
//         toast.error('Could not start checkout. Please try again.')
//       }
//     } catch (e) {
//       toast.error(e.message || 'Checkout failed.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <>
//       <div className="overlay" onClick={() => setCartOpen(false)} />
//       <aside className="cart-drawer">
//         <div className="cart-head">
//           <h2>Your Cart 🛒</h2>
//           <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
//         </div>

//         <div className="cart-items">
//           {cart.length === 0 ? (
//             <div className="empty-state">
//               <span className="icon">🧺</span>
//               <h3>Your cart is empty</h3>
//               <p>Add some handmade goodies!</p>
//             </div>
//           ) : cart.map(item => {
//             const cat = item.product.category || 'default'
//             return (
//               <div className="cart-item" key={item.product.id}>
//                 <div className="cart-thumb" style={{ background: CATEGORY_BG[cat] || CATEGORY_BG.default }}>
//                   {item.product.imageUrl || item.product.image
//                     ? <img src={item.product.imageUrl || item.product.image} alt={item.product.name} />
//                     : <span>{CATEGORY_EMOJI[cat] || CATEGORY_EMOJI.default}</span>
//                   }
//                 </div>
//                 <div style={{ flex: 1, minWidth: 0 }}>
//                   <p className="cart-item-name">{item.product.name}</p>
//                   <p className="cart-item-price">RS: {(item.product.price * item.qty).toLocaleString()}</p>
//                 </div>
//                 <div className="qty-ctrl">
//                   <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty - 1)}>−</button>
//                   <span className="qty-value">{item.qty}</span>
//                   <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty + 1)}>+</button>
//                 </div>
//                 <button className="cart-remove" onClick={() => removeFromCart(item.product.id)}>✕</button>
//               </div>
//             )
//           })}
//         </div>

//         {cart.length > 0 && (
//           <div className="cart-footer">
//             <div className="cart-total-row">
//               <span className="cart-total-label">Total</span>
//               <span className="cart-total-value">RS: {total.toLocaleString()}</span>
//             </div>
//             <button
//               className="btn btn-primary btn-full"
//               onClick={handleCheckout}
//               disabled={loading}
//             >
//               {loading ? 'Processing...' : user ? 'Checkout with Stripe →' : 'Sign In to Checkout'}
//             </button>
//             <p style={{ fontSize: 12, color: '#AAA', textAlign: 'center', marginTop: 10 }}>
//               🔒 Secured by Stripe
//             </p>
//           </div>
//         )}
//       </aside>
//     </>
//   )
// }

import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api'
import { useState } from 'react'
import toast from 'react-hot-toast'

const CATEGORY_BG    = { hats: '#FFE5EC', bags: '#E5F5E5', sweaters: '#FFF0E5', default: '#F0EFFF' }
const CATEGORY_EMOJI = { hats: '🪣', bags: '👜', sweaters: '🧥', default: '🧶' }

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, total, clearCart } = useCart()
  const { user, openAuth } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!cartOpen) return null

  const handleCheckout = async () => {
    if (!user) {
      setCartOpen(false)
      openAuth('login')
      return
    }
    setLoading(true)
    try {
      // Step 1: Create the order
      const items = cart.map(i => ({ productId: i.product.id, quantity: i.qty }))
      const order = await api.post('/orders', {
        items,
        StripeId: 'pending',
        type: 'premade'
      }, user.token)

      // Step 2: Create Stripe checkout session with the order id
      const session = await api.post('/checkout/create-session', {
        orderId: order.id,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl:  `${window.location.origin}/checkout/cancel`
      }, user.token)

      if (session.url) {
        clearCart()
        window.location.href = session.url
      } else {
        toast.error('Could not start checkout. Please try again.')
      }
    } catch (e) {
      toast.error(e.message || 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="overlay" onClick={() => setCartOpen(false)} />
      <aside className="cart-drawer">
        <div className="cart-head">
          <h2>Your Cart 🛒</h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <span className="icon">🧺</span>
              <h3>Your cart is empty</h3>
              <p>Add some handmade goodies!</p>
            </div>
          ) : cart.map(item => {
            const cat = item.product.category || 'default'
            return (
              <div className="cart-item" key={item.product.id}>
                <div className="cart-thumb" style={{ background: CATEGORY_BG[cat] || CATEGORY_BG.default }}>
                  {item.product.imageUrl || item.product.image
                    ? <img src={item.product.imageUrl || item.product.image} alt={item.product.name} />
                    : <span>{CATEGORY_EMOJI[cat] || CATEGORY_EMOJI.default}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="cart-item-name">{item.product.name}</p>
                  <p className="cart-item-price">RS: {(item.product.price * item.qty).toLocaleString()}</p>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty - 1)}>−</button>
                  <span className="qty-value">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.product.id, item.qty + 1)}>+</button>
                </div>
                <button className="cart-remove" onClick={() => removeFromCart(item.product.id)}>✕</button>
              </div>
            )
          })}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">RS: {total.toLocaleString()}</span>
            </div>
            <button className="btn btn-primary btn-full" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : user ? 'Checkout with Stripe →' : 'Sign In to Checkout'}
            </button>
            <p style={{ fontSize: 12, color: '#AAA', textAlign: 'center', marginTop: 10 }}>🔒 Secured by Stripe</p>
          </div>
        )}
      </aside>
    </>
  )
}
