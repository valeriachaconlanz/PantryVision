import { Link, NavLink } from 'react-router-dom'
import useAppState from '../hooks/useAppState.js'

const logo = <img src="/Logo_Placeholder.jpeg" alt="PantryVision" />

// variant: "home" (landing page links), "app" (logged in nav), or "bare" (just the logo)
export default function Header({ variant = 'app' }) {
  const { user } = useAppState()

  return (
    <header className={`site-header ${variant}`}>
      <div className="wrap">
        <Link className="logo" to="/">
          {logo}
        </Link>

        {variant === 'home' && (
          <nav aria-label="Main">
            <a className="nav-link" href="#how">
              How it works
            </a>
            <a className="nav-link" href="#privacy">
              Privacy
            </a>
            {user ? (
              <Link className="btn" to="/search">
                Open app
              </Link>
            ) : (
              <Link className="btn" to="/login">
                Log in
              </Link>
            )}
          </nav>
        )}

        {variant === 'app' && (
          <nav aria-label="Main">
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/library">Library</NavLink>
            <NavLink className="avatar" to="/profile" aria-label="Your profile">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}
