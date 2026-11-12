import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'
import useAppState from '../hooks/useAppState.js'
import Header from './Header.jsx'

// Layout for the logged in part of the app: header, page, and the phone tab bar.
// Sends you to the login page if you're not logged in.
export default function AppLayout() {
  const { user, loggedOut } = useAppState()
  const location = useLocation()

  if (!user) {
    if (loggedOut) return <Navigate to="/" replace />
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="has-tabbar">
      <Header variant="app" />
      <main className="wrap">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">
        <NavLink to="/search">Search</NavLink>
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/profile">Me</NavLink>
      </nav>
      <footer className="site-footer">
        <div className="wrap" />
      </footer>
    </div>
  )
}
