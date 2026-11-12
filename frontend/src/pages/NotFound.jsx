import { Link } from 'react-router-dom'
import Header from '../components/Header.jsx'

export default function NotFound({ inApp = false }) {
  const body = (
    <div style={{ textAlign: 'center', padding: '40px 0' }}>
      <h1>
        Huh, <span className="outline">nothing</span> here
      </h1>
      <p className="lede" style={{ margin: '0 auto 24px' }}>
        That page doesn't exist, or it got eaten.
      </p>
      <Link className="btn big red" to={inApp ? '/search' : '/'}>
        {inApp ? 'Back to searching' : 'Take me home'}
      </Link>
    </div>
  )

  if (inApp) return body
  return (
    <>
      <Header variant="bare" />
      <main className="wrap">{body}</main>
    </>
  )
}
