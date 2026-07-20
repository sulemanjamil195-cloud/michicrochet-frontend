import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import Shop from './pages/Shop'
import About from './pages/About'
import Orders from './pages/Orders'
import CustomOrder from './pages/CustomOrder'
import AdminAddProduct from './pages/AdminAddProduct'
import AdminProducts from './pages/AdminProducts'
import AdminOrders from './pages/AdminOrders'
import AdminCustomRequests from './pages/AdminCustomRequests'
import AdminSaleAlerts from './pages/AdminSaleAlerts'
import CheckoutSuccess from './pages/CheckoutSuccess'
import CheckoutCancel from './pages/CheckoutCancel'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <>
          <Navbar />
          <main>
            <Routes>
              <Route path="/"             element={<Home />} />
              <Route path="/shop"         element={<Shop />} />
              <Route path="/about"        element={<About />} />
              <Route path="/orders"       element={<Orders />} />
              <Route path="/custom-order" element={<CustomOrder />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/cancel"  element={<CheckoutCancel />} />
              <Route path="/admin/add-product"     element={<AdminAddProduct />} />
              <Route path="/admin/products"        element={<AdminProducts />} />
              <Route path="/admin/orders"          element={<AdminOrders />} />
              <Route path="/admin/custom-requests" element={<AdminCustomRequests />} />
              <Route path="/admin/sale-alerts"     element={<AdminSaleAlerts />} />
            </Routes>
          </main>
          <Footer />
          <CartDrawer />
          <AuthModal />
        </>
      </CartProvider>
    </AuthProvider>
  )
}
