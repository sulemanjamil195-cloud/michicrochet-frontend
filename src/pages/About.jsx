import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="about-page">
      <div className="about-hero">
        <span style={{ fontSize: 64, display: 'block', marginBottom: 24 }}>🧶</span>
        <h1>About MichiCrochet</h1>
        <p>
          Every piece is handcrafted with patience, love and warmth.
          MichiCrochet turns yarn into memories — one stitch at a time.
        </p>
      </div>

      <div className="about-values">
        <div className="values-grid">
          {[
            { icon: '💕', title: 'Made with Love', desc: 'Every product is created by hand, with genuine care poured into every stitch and knot.' },
            { icon: '🌿', title: 'Slow Fashion',   desc: 'We believe in quality over quantity. Each piece takes time, and that time shows in the finished result.' },
            { icon: '✨', title: 'One of a Kind',  desc: 'No two pieces are exactly alike. You get something truly unique, just for you.' },
          ].map(v => (
            <div key={v.title} className="value-card">
              <span className="icon">{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '4rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', marginBottom: 16, color: 'var(--dark)' }}>Our Story</h2>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--mid)', marginBottom: 14 }}>
              MichiCrochet started as a passion project — a love for yarn, color, and the meditative rhythm of crochet. What began as making gifts for friends and family grew into something much bigger.
            </p>
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'var(--mid)' }}>
              Today, every product in our shop is still handmade with the same care and attention as those very first pieces. We're proud to offer something the fast fashion world can't: something real, something warm, something made just for you.
            </p>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #FFE5EC, #E5F5E5)', borderRadius: 24, padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: 'var(--dark)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Every piece tells a story woven with patience, love, and warmth."
            </p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '2rem', marginBottom: 16 }}>Ready to find your piece?</h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
          <button className="btn btn-outline" onClick={() => navigate('/custom-order')}>Request Custom Order</button>
        </div>
      </div>
    </div>
  )
}
