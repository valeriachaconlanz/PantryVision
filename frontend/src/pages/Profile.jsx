import { useState } from 'react'
import DietForm from '../components/DietForm.jsx'
import useAppState from '../hooks/useAppState.js'
import { clearPhotoHistory, readPhotoHistory } from '../utils/photos.js'
import './Profile.css'

// FR-3: change your diet and allergies, manage your account, log out.
// FR-22: photo history only lives on this device.
export default function Profile() {
  const { user, logIn, logOut, deleteAccount, prefs, setPrefs, saved, ratings } = useAppState()
  const [email, setEmail] = useState(user.email)
  const [history, setHistory] = useState(readPhotoHistory)
  const [savedNote, setSavedNote] = useState(null)

  const name = user.email.split('@')[0]
  const joined = new Date(user.joined).toLocaleDateString([], { month: 'short', year: 'numeric' })

  function changePrefs(next) {
    setPrefs({ ...prefs, ...next })
    setSavedNote('Saved!')
  }

  function updateEmail(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return setSavedNote("That email doesn't look right.")
    // TODO: send this to the backend once accounts are real
    logIn(email.trim().toLowerCase())
    setSavedNote('Email updated!')
  }

  function clearHistory() {
    clearPhotoHistory()
    setHistory([])
  }

  function remove() {
    if (window.confirm('Delete your account? Your saved recipes and ratings will be gone for good.')) {
      deleteAccount()
    }
  }

  return (
    <div className="profile">
      <div className="me">
        <div className="big-avatar" aria-hidden="true">
          {name[0]?.toUpperCase()}
        </div>
        <div>
          <h1>Hey {name}</h1>
          <div className="muted">
            {user.email} · Cooking since {joined} · {saved.length} saved · {Object.keys(ratings).length} rated
          </div>
        </div>
      </div>

      {savedNote && (
        <p className="tag green saved-note" role="status">
          {savedNote}
        </p>
      )}

      <div className="profile-grid">
        <div className="stack">
          <DietForm diets={prefs.diets} allergies={prefs.allergies} onChange={changePrefs} />
        </div>

        <div className="stack">
          <form className="panel" onSubmit={updateEmail}>
            <h2>Account</h2>
            <label className="field">
              Email
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <div className="row">
              <button type="submit" className="btn" disabled={email === user.email}>
                Update
              </button>
              {/* TODO: real password reset once auth is in */}
              <button type="button" className="link" onClick={() => setSavedNote('Password reset is coming soon.')}>
                Change password
              </button>
            </div>
          </form>

          <section className="panel">
            <h2 className="spread">
              Photo history
              {history.length > 0 && (
                <button type="button" className="link" onClick={clearHistory}>
                  Clear
                </button>
              )}
            </h2>
            <p className="note">These only live on this device. We never save your pics on our servers.</p>
            {history.length ? (
              <div className="history">
                {history.map((h, i) => (
                  <img key={`${h.at}-${i}`} src={h.src} alt="" />
                ))}
              </div>
            ) : (
              <p className="muted" style={{ margin: 0 }}>
                No photos yet.
              </p>
            )}
          </section>
        </div>
      </div>

      <div className="danger-zone">
        <button
          type="button"
          className="btn"
          onClick={logOut}
        >
          Log out
        </button>
        <button type="button" className="btn ghost-red" onClick={remove}>
          Delete my account
        </button>
      </div>
    </div>
  )
}
