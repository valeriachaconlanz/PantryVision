import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import PrivacyNote from '../components/PrivacyNote.jsx'
import useAppState from '../hooks/useAppState.js'
import './Home.css'

const SHELF = [
  { left: '12%', top: '16%', width: '22%', height: '16%', background: 'var(--tomato)' },
  { left: '42%', top: '12%', width: '30%', height: '20%', background: '#fff' },
  { left: '14%', top: '44%', width: '34%', height: '14%', background: 'var(--leaf)' },
  { left: '56%', top: '40%', width: '20%', height: '18%', background: 'var(--yolk)' },
  { left: '20%', top: '70%', width: '46%', height: '14%', background: 'var(--paper)' },
]

const TAGS = [
  { name: 'tomatoes', color: 'var(--tomato)', left: '44%', top: '6%', turn: 4 },
  { name: 'eggs', color: '#fff', left: '52%', top: '24%', turn: -3 },
  { name: 'spinach', color: 'var(--leaf)', left: '-2%', top: '52%', turn: -5 },
  { name: 'feta', color: 'var(--yolk)', left: '50%', top: '42%', turn: 3 },
]

export default function Home() {
  const { user } = useAppState()
  const [showPrivacy, setShowPrivacy] = useState(false)
  const start = user ? '/search' : '/signup'

  return (
    <>
      <Header variant="home" />

      <main className="wrap">
        <section className="hero">
          <div>
            <h1>
              Got food?
              <br />
              <span className="outline">Got no</span>
              <br />
              idea what
              <br />
              to make?
            </h1>
            <p>Snap a pic of your fridge and we'll give you 3 recipes using what you already have.</p>
            <div className="ctas">
              <Link className="btn big red" to={start}>
                Snap my fridge
              </Link>
              <Link className="link" to={start}>
                or type what you have
              </Link>
            </div>
            <small>Works with your diet: keto, vegan, no seed oils, and more.</small>
          </div>

          <div className="demo" aria-hidden="true">
            <div className="photo">
              {SHELF.map((s, i) => (
                <div key={i} className="shelf-item" style={s} />
              ))}
            </div>
            {TAGS.map((t) => (
              <span key={t.name} className="fridge-tag" style={{ left: t.left, top: t.top, transform: `rotate(${t.turn}deg)` }}>
                <i style={{ background: t.color }} />
                {t.name}
              </span>
            ))}
            <div className="demo-card">
              <div className="kicker">Recipe 1 of 3</div>
              <h3>Spinach &amp; feta shakshuka</h3>
              <div className="row" style={{ gap: 8 }}>
                <span className="tag">Prep 5 min</span>
                <span className="tag">Cook 15 min</span>
                <span className="tag yolk">4.6 / 5</span>
              </div>
            </div>
          </div>
        </section>

        <section className="how" id="how">
          <div className="how-card">
            <aside>
              <h2>How it works</h2>
              <ul>
                <li>1 fridge (or pantry)</li>
                <li>1 phone</li>
                <li>About 30 seconds</li>
              </ul>
            </aside>
            <ol>
              <li>
                <div>
                  <b>Show us your food</b>Take up to 3 photos, type your ingredients, or just say them out loud.
                </div>
              </li>
              <li>
                <div>
                  <b>Pick your meal</b>Breakfast, lunch, dinner, or dessert. Add your cooking tools and how much time you
                  have.
                </div>
              </li>
              <li>
                <div>
                  <b>Get 3 recipes</b>Each one shows prep time, cook time, and what other people rated it. Don't like
                  them? Get 3 more.
                </div>
              </li>
            </ol>
          </div>
        </section>
      </main>

      <section className="privacy-band" id="privacy">
        <div className="wrap">
          <div>
            <h2>Your fridge pics stay private</h2>
            <p>
              We only use your photos to find ingredients, then they're gone. Your photo history stays on your phone, not
              on our servers.
            </p>
          </div>
          <button type="button" className="btn" onClick={() => setShowPrivacy((v) => !v)} aria-expanded={showPrivacy}>
            {showPrivacy ? 'Hide the privacy note' : 'Read the privacy note'}
          </button>
        </div>
      </section>
      {showPrivacy && (
        <div className="wrap" style={{ marginTop: 28 }}>
          <PrivacyNote onClose={() => setShowPrivacy(false)} />
        </div>
      )}

      <footer className="site-footer">
        <div className="wrap" style={{ paddingTop: 22 }}>
          <span>PantryVision, est. 2026</span>
          <span>Made by Team 7</span>
        </div>
      </footer>
    </>
  )
}
