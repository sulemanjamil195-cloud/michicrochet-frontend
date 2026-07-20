// import { useNavigate } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import { api } from '../api'
// import ProductCard from '../components/ProductCard'
// import toast from 'react-hot-toast'

// export default function Home() {
//   const navigate = useNavigate()
//   const [featured, setFeatured] = useState([])
//   const [email, setEmail] = useState('')
//   const [subscribed, setSubscribed] = useState(false)

//   useEffect(() => {
//     api.get('/products')
//       .then(d => setFeatured((Array.isArray(d) ? d : []).slice(0, 3)))
//       .catch(() => {})
//   }, [])

//   const handleAlert = async () => {
//     if (!email || !email.includes('@')) { toast.error('Enter a valid email.'); return }
//     try {
//       await api.post('/sale-alerts', { email })
//       setSubscribed(true)
//       toast.success("You're on the list! 🎉")
//     } catch {
//       try { await api.post('/emails', { email }); setSubscribed(true); toast.success("You're on the list! 🎉") }
//       catch { toast.error('Something went wrong. Try again.') }
//     }
//   }

//   return (
//     <>
//       {/* ─── HERO ─────────────────────────────────────────────────── */}
//       <section className="hero">
//         <div className="hero-blob" style={{ bottom: 60, left: 50, width: 200, height: 200, background: 'rgba(217,95,122,.10)' }} />
//         <div className="hero-blob" style={{ top: 50, right: 80, width: 150, height: 150, background: 'rgba(245,200,66,.18)' }} />
//         <div className="hero-blob" style={{ top: '35%', left: '42%', width: 100, height: 100, background: 'rgba(90,115,85,.12)' }} />

//         <div className="hero-inner">
//           <div>
//             <p className="hero-eyebrow">Handmade with love ✨</p>
//             <h1 className="hero-title">
//               Soft.<br />Cozy.<br /><span>Handmade.</span>
//             </h1>
//             <p className="hero-subtitle">
//               Inspired by yarn, flowers & love. Every piece tells a story woven with patience, care, and warmth.
//             </p>
//             <div className="hero-cta">
//               <button className="btn btn-primary" onClick={() => navigate('/shop')}>Explore Collection</button>
//               <button className="btn btn-outline" onClick={() => navigate('/about')}>Our Story</button>
//             </div>
//           </div>

//           <div className="hero-feature-grid">
//             {[
//               ['Hats',     '🪣', '#FFE5EC'],
//               ['Bags',     '👜', '#E5F5E5'],
//               ['Sweaters', '🧶', '#FFF5E5'],
//               ['Custom',   '✨', '#EDE5FF'],
//             ].map(([name, emoji, color]) => (
//               <div key={name} className="hero-feature-card" style={{ background: color }}
//                 onClick={() => navigate(name === 'Custom' ? '/custom-order' : '/shop')}>
//                 <span className="emoji">{emoji}</span>
//                 <span className="label">{name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ─── FEATURED PRODUCTS ───────────────────────────────────── */}
//       {featured.length > 0 && (
//         <section style={{ padding: '5rem 2rem', background: '#EEF8F8' }}>
//           <div className="container">
//             <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
//               <h2 className="section-title">Our Bestsellers</h2>
//               <p className="section-sub">Loved by customers, made with heart 💗</p>
//             </div>
//             <div className="products-grid">
//               {featured.map(p => <ProductCard key={p.id} product={p} />)}
//             </div>
//             <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
//               <button className="btn btn-sage" onClick={() => navigate('/shop')}>View All Products →</button>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ─── CUSTOM ORDER CTA ────────────────────────────────────── */}
//       <section style={{ padding: '6rem 2rem', background: '#fff' }}>
//         <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
//           <span style={{ fontSize: 52 }}>🪡</span>
//           <h2 className="section-title" style={{ marginTop: 20, marginBottom: 12 }}>Have something in mind?</h2>
//           <p className="section-sub" style={{ marginBottom: 32, fontSize: 16, lineHeight: 1.8 }}>
//             We take custom orders! Describe your dream piece — color, size, pattern — and we'll crochet it just for you.
//           </p>
//           <button className="btn btn-primary" onClick={() => navigate('/custom-order')}>Request a Custom Piece</button>
//         </div>
//       </section>

//       {/* ─── SALE ALERTS ─────────────────────────────────────────── */}
//       <section className="sale-section">
//         <div className="sale-inner">
//           <div style={{ fontSize: 40, marginBottom: 14 }}>🔔</div>
//           <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 10 }}>Get Sale Alerts!</h2>
//           <p style={{ color: 'var(--mid)', fontSize: 15, lineHeight: 1.7 }}>
//             Be the first to know about new arrivals, restocks, and exclusive sales.
//           </p>
//           {subscribed ? (
//             <div style={{ marginTop: 28, background: '#fff', borderRadius: 16, padding: '1.5rem', color: '#166534' }}>
//               <p style={{ fontWeight: 600, fontSize: 16 }}>🎉 You're on the list!</p>
//             </div>
//           ) : (
//             <div className="sale-email-row">
//               <input
//                 type="email"
//                 className="input"
//                 placeholder="your@email.com"
//                 value={email}
//                 onChange={e => setEmail(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && handleAlert()}
//                 style={{ borderRadius: 40, flex: 1 }}
//               />
//               <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={handleAlert}>Notify Me</button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ─── ABOUT PREVIEW ───────────────────────────────────────── */}
//       <section style={{
//         padding: '6rem 2rem',
//         background: 'linear-gradient(135deg, #F5E6EA 0%, #E8F0E8 100%)',
//         textAlign: 'center',
//       }}>
//         <div style={{ maxWidth: 680, margin: '0 auto' }}>
//           <span style={{ fontSize: 52 }}>🧶</span>
//           <h2 className="section-title" style={{ marginTop: 20, marginBottom: 16 }}>About MichiCrochet</h2>
//           <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--mid)', marginBottom: 10 }}>
//             Every piece is handcrafted with patience, love and warmth.
//           </p>
//           <p style={{ fontSize: 15, lineHeight: 1.8, color: '#666', marginBottom: 32 }}>
//             MichiCrochet turns yarn into memories. From cozy hats to beautiful sweaters and elegant bags, each item is made with care — one stitch at a time.
//           </p>
//           <button className="btn btn-outline" onClick={() => navigate('/about')}>Read Our Story</button>
//         </div>
//       </section>
//     </>
//   )
// }
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api } from '../api'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export default function Home() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    api.get('/products')
      .then(d => setFeatured((Array.isArray(d) ? d : []).slice(0, 3)))
      .catch(() => {})
  }, [])

  const handleAlert = async () => {
    if (!email || !email.includes('@')) { toast.error('Enter a valid email.'); return }
    try {
      await api.post('/sale-alerts/subscribe', { email })
      setSubscribed(true)
      toast.success("You're on the list! 🎉")
    } catch {
      try { await api.post('/emails/subscribe', { email }); setSubscribed(true); toast.success("You're on the list! 🎉") }
      catch { toast.error('Something went wrong. Try again.') }
    }
  }

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-blob" style={{ bottom: 60, left: 50, width: 200, height: 200, background: 'rgba(217,95,122,.10)' }} />
        <div className="hero-blob" style={{ top: 50, right: 80, width: 150, height: 150, background: 'rgba(245,200,66,.18)' }} />
        <div className="hero-blob" style={{ top: '35%', left: '42%', width: 100, height: 100, background: 'rgba(90,115,85,.12)' }} />

        <div className="hero-inner">
          <div>
            <p className="hero-eyebrow">Handmade with love ✨</p>
            <h1 className="hero-title">
              Soft.<br />Cozy.<br /><span>Handmade.</span>
            </h1>
            <p className="hero-subtitle">
              Inspired by yarn, flowers & love. Every piece tells a story woven with patience, care, and warmth.
            </p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('/shop')}>Explore Collection</button>
              <button className="btn btn-outline" onClick={() => navigate('/about')}>Our Story</button>
            </div>
          </div>

          <div className="hero-feature-grid">
            {[
              ['Hats',     '🪣', '#FFE5EC'],
              ['Bags',     '👜', '#E5F5E5'],
              ['Sweaters', '🧶', '#FFF5E5'],
              ['Custom',   '✨', '#EDE5FF'],
            ].map(([name, emoji, color]) => (
              <div key={name} className="hero-feature-card" style={{ background: color }}
                onClick={() => navigate(name === 'Custom' ? '/custom-order' : '/shop')}>
                <span className="emoji">{emoji}</span>
                <span className="label">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ───────────────────────────────────── */}
      {featured.length > 0 && (
        <section style={{ padding: '5rem 2rem', background: '#EEF8F8' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">Our Bestsellers</h2>
              <p className="section-sub">Loved by customers, made with heart 💗</p>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
              <button className="btn btn-sage" onClick={() => navigate('/shop')}>View All Products →</button>
            </div>
          </div>
        </section>
      )}

      {/* ─── CUSTOM ORDER CTA ────────────────────────────────────── */}
      <section style={{ padding: '6rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: 52 }}>🪡</span>
          <h2 className="section-title" style={{ marginTop: 20, marginBottom: 12 }}>Have something in mind?</h2>
          <p className="section-sub" style={{ marginBottom: 32, fontSize: 16, lineHeight: 1.8 }}>
            We take custom orders! Describe your dream piece — color, size, pattern — and we'll crochet it just for you.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/custom-order')}>Request a Custom Piece</button>
        </div>
      </section>

      {/* ─── SALE ALERTS ─────────────────────────────────────────── */}
      <section className="sale-section">
        <div className="sale-inner">
          <div style={{ fontSize: 40, marginBottom: 14 }}>🔔</div>
          <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: 10 }}>Get Sale Alerts!</h2>
          <p style={{ color: 'var(--mid)', fontSize: 15, lineHeight: 1.7 }}>
            Be the first to know about new arrivals, restocks, and exclusive sales.
          </p>
          {subscribed ? (
            <div style={{ marginTop: 28, background: '#fff', borderRadius: 16, padding: '1.5rem', color: '#166534' }}>
              <p style={{ fontWeight: 600, fontSize: 16 }}>🎉 You're on the list!</p>
            </div>
          ) : (
            <div className="sale-email-row">
              <input
                type="email"
                className="input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAlert()}
                style={{ borderRadius: 40, flex: 1 }}
              />
              <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }} onClick={handleAlert}>Notify Me</button>
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT PREVIEW ───────────────────────────────────────── */}
      <section style={{
        padding: '6rem 2rem',
        background: 'linear-gradient(135deg, #F5E6EA 0%, #E8F0E8 100%)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <span style={{ fontSize: 52 }}>🧶</span>
          <h2 className="section-title" style={{ marginTop: 20, marginBottom: 16 }}>About MichiCrochet</h2>
          <p style={{ fontSize: 17, lineHeight: 1.85, color: 'var(--mid)', marginBottom: 10 }}>
            Every piece is handcrafted with patience, love and warmth.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: '#666', marginBottom: 32 }}>
            MichiCrochet turns yarn into memories. From cozy hats to beautiful sweaters and elegant bags, each item is made with care — one stitch at a time.
          </p>
          <button className="btn btn-outline" onClick={() => navigate('/about')}>Read Our Story</button>
        </div>
      </section>
    </>
  )
}
