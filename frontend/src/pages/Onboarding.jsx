import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import DietForm from '../components/DietForm.jsx'
import Header from '../components/Header.jsx'
import useAppState from '../hooks/useAppState.js'

// FR-1: the diet + allergy survey you see right after signing up.
export default function Onboarding() {
  const { user, prefs, setPrefs } = useAppState()
  const navigate = useNavigate()
  const [draft, setDraft] = useState({ diets: prefs.diets, allergies: prefs.allergies })

  if (!user) return <Navigate to="/signup" replace />

  function finish(save) {
    setPrefs(save ? { ...draft, done: true } : { ...prefs, done: true })
    navigate('/search')
  }

  return (
    <>
      <Header variant="bare" />
      <main className="wrap narrow onboarding">
        <div className="progress" aria-hidden="true">
          <i className="done" />
          <i className="done" />
        </div>
        <div className="step-label">Almost done</div>
        <h1>How do you eat?</h1>
        <p className="lede">Every recipe we show you will follow this. You can change it later in your profile.</p>

        <div className="stack">
          <DietForm diets={draft.diets} allergies={draft.allergies} onChange={setDraft} />
        </div>

        <div className="actions">
          <button type="button" className="link" onClick={() => finish(false)}>
            Skip for now
          </button>
          <button type="button" className="btn big red" onClick={() => finish(true)}>
            Save and start cooking
          </button>
        </div>
      </main>
      <footer className="site-footer">
        <div className="wrap" />
      </footer>
    </>
  )
}
