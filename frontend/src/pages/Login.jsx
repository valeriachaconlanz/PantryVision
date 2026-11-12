import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header.jsx'
import useAppState from '../hooks/useAppState.js'
import './Login.css'

// FR-2: sign up and log in with email + password.
// mode is "signup" or "login" (both live on this one page with tabs).
// TODO: this only pretends to log you in. Hook it up to real auth once we pick
// Supabase Auth or Spring Security.
export default function Login({ mode = 'login' }) {
  const { logIn, prefs } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const signingUp = mode === 'signup'

  function submit(e) {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("That email doesn't look right.")
      return
    }
    if (password.length < 8) {
      setError('Password needs at least 8 characters.')
      return
    }
    logIn(email.trim().toLowerCase())
    if (signingUp || !prefs.done) {
      navigate('/onboarding')
    } else {
      navigate(location.state?.from ?? '/search')
    }
  }

  return (
    <>
      <Header variant="bare" />
      <main className="wrap auth">
        <div>
          <h1>
            {signingUp ? 'Make an' : 'Welcome'}
            <br />
            <span className="outline">{signingUp ? 'account' : 'back'}</span>
          </h1>
          <p className="lede">
            {signingUp
              ? 'So we remember how you eat and you can save the recipes you love.'
              : "Log in and let's figure out dinner."}
          </p>
          {signingUp && (
            <ul className="perks">
              <li>
                <b>1</b> Tell us your diet once, every recipe follows it
              </li>
              <li>
                <b>2</b> Save recipes to your library
              </li>
              <li>
                <b>3</b> Rate what you cooked
              </li>
            </ul>
          )}
        </div>

        <form className="panel" onSubmit={submit} noValidate>
          <div className="tabs">
            <Link className={signingUp ? 'on' : ''} to="/signup">
              Sign up
            </Link>
            <Link className={signingUp ? '' : 'on'} to="/login">
              Log in
            </Link>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <label className="field">
            Email
            <input
              className="input"
              type="email"
              autoComplete="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="field">
            Password {signingUp && <span className="hint">(8+ characters)</span>}
            <input
              className="input"
              type="password"
              autoComplete={signingUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button className="btn big red block" type="submit">
            {signingUp ? 'Create account' : 'Log in'}
          </button>
          <p className="fine">
            {signingUp ? (
              <>
                Already have one? <Link className="link" to="/login">Log in</Link>
              </>
            ) : (
              <>
                New here? <Link className="link" to="/signup">Make an account</Link>
              </>
            )}
          </p>
        </form>
      </main>
    </>
  )
}
