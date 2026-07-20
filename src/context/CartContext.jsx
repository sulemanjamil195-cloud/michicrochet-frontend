import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'michicrochet_cart'

function loadInitialCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadInitialCart)
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.product.id === product.id)
      if (exists) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { product, qty }]
    })
  }

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.product.id !== productId))

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeFromCart(productId)
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const total = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0)
  const itemCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
