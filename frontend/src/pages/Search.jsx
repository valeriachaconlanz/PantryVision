import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ChipPicker from '../components/ChipPicker.jsx'
import useAppState from '../hooks/useAppState.js'
import { SAMPLE_INGREDIENTS } from '../data/sampleRecipes.js'
import { MEALS, NO_DIET, TIMES, TOOLS, mealForHour } from '../data/options.js'
import useSpeech from '../hooks/useSpeech.js'
import { parseIngredients } from '../utils/ingredients.js'
import { ACCEPTED, MAX_PHOTOS, addToPhotoHistory, compressPhoto } from '../utils/photos.js'
import './Search.css'

const MODES = [
  { id: 'photo', label: 'Photo', hint: 'up to 3 pics' },
  { id: 'text', label: 'Type it', hint: 'list your stuff' },
  { id: 'voice', label: 'Say it', hint: 'use your mic' },
]

// FR-4 to FR-8, FR-16, FR-17: show us your food, pick a meal, tools and time.
export default function Search() {
  const { prefs, setSearch } = useAppState()
  const navigate = useNavigate()
  const fileInput = useRef(null)
  const [now] = useState(() => new Date())

  const [mode, setMode] = useState('photo')
  const [photos, setPhotos] = useState([]) // { id, blob, previewUrl, thumb, name }
  const [text, setText] = useState('')
  const [meal, setMeal] = useState(mealForHour(now.getHours()))
  const [tools, setTools] = useState(['Stovetop', 'Oven', 'Microwave'])
  const [time, setTime] = useState('30 min')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [analyzing, setAnalyzing] = useState(null) // list of ingredients being "found"

  const speech = useSpeech((heard) => setText((t) => (t ? `${t}, ${heard}` : heard)))

  // free the preview urls when photos go away
  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])
  const timer = useRef(null)
  useEffect(
    () => () => {
      clearTimeout(timer.current)
      photosRef.current.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl))
    },
    [],
  )

  async function addPhotos(fileList) {
    setError(null)
    const files = [...fileList].slice(0, MAX_PHOTOS - photos.length)
    if (fileList.length > files.length) setError(`You can add up to ${MAX_PHOTOS} photos.`)
    setBusy(true)
    try {
      const added = []
      for (const file of files) {
        const result = await compressPhoto(file)
        added.push({ ...result, id: crypto.randomUUID(), name: file.name })
      }
      setPhotos((list) => [...list, ...added])
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  function removePhoto(id) {
    setPhotos((list) => {
      const gone = list.find((p) => p.id === id)
      if (gone?.previewUrl) URL.revokeObjectURL(gone.previewUrl)
      return list.filter((p) => p.id !== id)
    })
  }

  function findRecipes() {
    const typed = parseIngredients(text)
    if (mode === 'photo' && photos.length === 0) {
      setError('Add at least one photo first, or switch to typing.')
      return
    }
    if (mode !== 'photo' && typed.length === 0) {
      setError(mode === 'voice' ? "We didn't hear any ingredients yet." : 'Type at least one ingredient.')
      return
    }
    setError(null)

    // TODO: send the photos or the list to the backend and use what the AI finds.
    // For now photos just pretend to find the sample ingredients.
    const found = mode === 'photo' ? SAMPLE_INGREDIENTS : typed
    if (mode === 'photo') addToPhotoHistory(photos.map((p) => p.thumb))

    setSearch({
      ingredients: found,
      meal,
      tools,
      maxMinutes: TIMES.find((t) => t.label === time)?.minutes ?? null,
    })
    setAnalyzing(found)
    timer.current = setTimeout(() => navigate('/recipes'), 2600)
  }

  if (analyzing) return <Analyzing found={analyzing} fromPhoto={mode === 'photo'} />

  const prefList = [...prefs.diets.filter((d) => d !== NO_DIET).map((d) => d.toLowerCase()), ...prefs.allergies.map((a) => `no ${a.toLowerCase()}`)]

  return (
    <div className="search">
      <h1>What's in your kitchen?</h1>
      <p className="lede">Show us what you've got, pick a meal, and we'll find 3 recipes.</p>

      <div className="search-grid">
        <section className="panel">
          <div className="modes" role="tablist" aria-label="How do you want to add food?">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                className="mode"
                onClick={() => {
                  setMode(m.id)
                  setError(null)
                }}
              >
                {m.label}
                <small>{m.hint}</small>
              </button>
            ))}
          </div>

          {mode === 'photo' && (
            <>
              <div className="photos">
                {photos.map((p) => (
                  <div key={p.id} className="thumb" style={p.previewUrl ? { backgroundImage: `url(${p.previewUrl})` } : undefined}>
                    {!p.previewUrl && <span className="thumb-name">{p.name}</span>}
                    <button type="button" className="rm" onClick={() => removePhoto(p.id)} aria-label={`Remove ${p.name}`}>
                      ✕
                    </button>
                  </div>
                ))}
                {photos.length < MAX_PHOTOS && (
                  <button type="button" className="drop" onClick={() => fileInput.current?.click()} disabled={busy}>
                    <span>
                      <b>+</b>
                      {busy ? 'Shrinking...' : photos.length ? 'Add another' : 'Add a pic'}
                    </span>
                  </button>
                )}
              </div>
              <input
                ref={fileInput}
                type="file"
                accept={ACCEPTED}
                multiple
                hidden
                onChange={(e) => addPhotos(e.target.files)}
              />
              <p className="fineprint">
                PNG, JPEG or HEIC. We shrink them on your phone before uploading, and we don't keep them after.
              </p>
            </>
          )}

          {mode === 'text' && (
            <label className="field">
              What do you have? <span className="hint">(separate with commas)</span>
              <textarea
                className="input"
                placeholder="eggs, half a bag of spinach, feta, 2 tomatoes"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
          )}

          {mode === 'voice' && (
            <div className="voice">
              {speech.supported ? (
                <>
                  <button
                    type="button"
                    className={`mic ${speech.listening ? 'on' : ''}`}
                    onClick={speech.listening ? speech.stop : speech.start}
                    aria-pressed={speech.listening}
                  >
                    {speech.listening ? 'Stop' : 'Tap to talk'}
                  </button>
                  <p className="muted">
                    {speech.listening ? 'Listening... just say what you have.' : 'Say something like "eggs, spinach and feta".'}
                  </p>
                  {speech.error && <p className="error">{speech.error}</p>}
                </>
              ) : (
                <p className="note">Your browser doesn't do voice input. Try Chrome or Safari, or just type it.</p>
              )}
              <label className="field">
                What we heard <span className="hint">(you can fix it)</span>
                <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} />
              </label>
            </div>
          )}
        </section>

        <aside className="panel side">
          <div className="group">
            <h2>Which meal?</h2>
            <div className="meals" role="group" aria-label="Meal">
              {MEALS.map((m) => (
                <button key={m} type="button" className="meal" aria-pressed={meal === m} onClick={() => setMeal(m)}>
                  {m}
                  {m === mealForHour(now.getHours()) && (
                    <small>it's {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase()}</small>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="group">
            <h2>What can you cook with?</h2>
            <ChipPicker label="Cooking tools" options={TOOLS} value={tools} onChange={setTools} />
          </div>
          <div className="group">
            <h2>How much time?</h2>
            <ChipPicker label="Time" options={TIMES.map((t) => t.label)} value={time} onChange={setTime} multiple={false} />
          </div>
          <div className="note prefs">
            {prefList.length ? (
              <>
                Using your prefs: <b>{prefList.join(', ')}</b>.{' '}
              </>
            ) : (
              'No diet prefs set. '
            )}
            <Link className="link" to="/profile">
              Change
            </Link>
          </div>
          {error && (
            <p className="error" role="alert" style={{ marginTop: 16 }}>
              {error}
            </p>
          )}
          <button type="button" className="btn big red block find" onClick={findRecipes} disabled={busy}>
            Find my recipes
          </button>
        </aside>
      </div>
    </div>
  )
}

// FR-8: something fun to look at while the photos get analyzed.
function Analyzing({ found, fromPhoto }) {
  return (
    <div className="analyzing" aria-live="polite">
      <div className="pot" aria-hidden="true">
        <span className="steam" style={{ left: 70 }} />
        <span className="steam" style={{ left: 104, animationDelay: '.45s' }} />
        <span className="steam" style={{ left: 138, animationDelay: '.9s' }} />
        <div className="lid" />
        <span className="handle" style={{ left: 0 }} />
        <span className="handle" style={{ right: 0 }} />
        <div className="pot-body" />
      </div>
      <h1>{fromPhoto ? 'Checking your fridge...' : 'Cooking up ideas...'}</h1>
      <p className="lede">{fromPhoto ? "Here's what we spotted so far." : 'Working with:'}</p>
      <div className="chips found">
        {found.map((name, i) => (
          <span key={name} className="chip on" style={{ animationDelay: `${i * 0.3}s` }}>
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
