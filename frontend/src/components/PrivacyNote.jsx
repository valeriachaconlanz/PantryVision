import { useEffect, useState } from 'react'
import { apiFetch } from '../api/client.js'

// FR-21: the privacy note. Loads it from the backend and remembers when you accept it.

function getClientId() {
  try {
    let id = localStorage.getItem('pv.clientId')
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem('pv.clientId', id)
    }
    return id
  } catch {
    return null
  }
}

export default function PrivacyNote({ onClose }) {
  const [notice, setNotice] = useState(null)
  const [error, setError] = useState(null)
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    apiFetch('/privacy')
      .then(setNotice)
      .catch(() => setError("Couldn't load the privacy note. Is the backend running?"))
  }, [])

  async function accept() {
    const clientId = getClientId()
    try {
      if (clientId && notice) {
        await apiFetch('/privacy/accept', {
          method: 'POST',
          body: JSON.stringify({ clientId, version: notice.version }),
        })
      }
      setAccepted(true)
    } catch {
      setError("Couldn't save that, try again in a sec.")
    }
  }

  return (
    <div className="privacy-note panel" role="dialog" aria-labelledby="privacy-title">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2 id="privacy-title">{notice?.title ?? 'Your privacy'}</h2>
        <button type="button" className="link" onClick={onClose}>
          Close
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {!notice && !error && <p>Loading...</p>}
      {notice?.sections.map((s) => (
        <section key={s.heading}>
          <h3>{s.heading}</h3>
          <p>{s.body}</p>
        </section>
      ))}
      {notice && (
        <div className="row">
          {accepted ? (
            <span className="tag green">Got it, thanks!</span>
          ) : (
            <button type="button" className="btn green" onClick={accept}>
              Sounds good
            </button>
          )}
          <span className="muted" style={{ fontSize: 14 }}>
            Version {notice.version}, updated {notice.lastUpdated}
          </span>
        </div>
      )}
    </div>
  )
}
