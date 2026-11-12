import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getRecipe } from '../api/recipes.js'
import { Plate } from '../components/RecipeCard.jsx'
import { likesText } from '../utils/recipeText.js'
import useAppState from '../hooks/useAppState.js'
import NotFound from './NotFound.jsx'
import './RecipeDetail.css'

// FR-14, FR-15: ingredients, steps, where it's from, and rate it.
export default function RecipeDetail() {
  const { id } = useParams()
  const { search, isSaved, toggleSaved, saved } = useAppState()

  // the search results already have everything we need, so only call the API
  // if you came here some other way (like from your library)
  const fromSearch = search.results?.find((r) => String(r.id) === id) ?? null
  const [fetched, setFetched] = useState({ id: null, recipe: null, error: null })
  const recipe = fromSearch ?? (fetched.id === id ? fetched.recipe : null)
  const error = fetched.id === id ? fetched.error : null

  useEffect(() => {
    if (fromSearch || !/^\d+$/.test(id)) return
    let cancelled = false
    getRecipe(id, search.ingredients)
      .then((r) => !cancelled && setFetched({ id, recipe: r, error: null }))
      .catch((err) => !cancelled && setFetched({ id, recipe: null, error: err }))
    return () => {
      cancelled = true
    }
  }, [id, fromSearch, search.ingredients])

  if (!/^\d+$/.test(id) || error?.status === 404) return <NotFound inApp />
  if (error) {
    return (
      <div className="empty" style={{ textAlign: 'center', padding: '40px 0' }}>
        <h1>Hmm, that didn't load</h1>
        <p className="lede" style={{ margin: '0 auto 24px' }}>
          {error.message}
        </p>
        <Link className="btn red" to="/recipes">
          Back to my recipes
        </Link>
      </div>
    )
  }
  if (!recipe) return <p className="loading-line">Getting the recipe...</p>

  // only say have it / need if we actually know what's in your kitchen
  const knowPantry = search.ingredients.length > 0
  const savedEntry = saved.find((s) => s.id === id)
  const meal = savedEntry?.meal ?? search.meal

  return (
    <div className="recipe-detail">
      <Link className="back link" to={fromSearch ? '/recipes' : '/library'}>
        ← {fromSearch ? 'Back to my recipes' : 'Back to my library'}
      </Link>

      <div className="top">
        <div>
          <h1>{recipe.title}</h1>
          <div className="meta">
            {recipe.prepMinutes != null && <span className="tag">Prep {recipe.prepMinutes} min</span>}
            {recipe.cookMinutes != null && <span className="tag">Cook {recipe.cookMinutes} min</span>}
            {recipe.servings != null && <span className="tag">Serves {recipe.servings}</span>}
            {recipe.score != null && <span className="tag yolk">★ {recipe.score.toFixed(1)}</span>}
            {recipe.likes != null && <span className="tag">{likesText(recipe.likes)}</span>}
            {recipe.diets?.slice(0, 3).map((d) => (
              <span key={d} className="tag green">
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="actions">
          <ShareButton title={recipe.title} />
          <button type="button" className={`btn ${isSaved(id) ? 'green' : 'red'}`} onClick={() => toggleSaved(recipe, meal)}>
            {isSaved(id) ? 'Saved ✓' : 'Save to library'}
          </button>
        </div>
      </div>

      {recipe.image && (
        <div className="hero-photo">
          <Plate recipe={recipe} big />
        </div>
      )}

      <div className="recipe-card">
        <aside>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing, i) => (
              <li key={`${i}-${ing.text}`} className={knowPantry && !ing.have ? 'need' : ''}>
                {ing.text} {knowPantry && <small>{ing.have ? 'HAVE IT' : 'NEED'}</small>}
              </li>
            ))}
          </ul>
        </aside>
        <div className="steps">
          <h2>Steps</h2>
          {recipe.steps.length ? (
            <ol>
              {recipe.steps.map((step, i) => (
                <li key={i}>
                  <div>{step}</div>
                </li>
              ))}
            </ol>
          ) : (
            <p>No steps listed here, check the original recipe below.</p>
          )}
        </div>
      </div>

      <div className="bottom">
        <RateIt id={id} />
        <section className="panel">
          <h2>Where this is from</h2>
          <p>
            Original recipe by <b>{recipe.source ?? 'Spoonacular'}</b>, found through Spoonacular.
          </p>
          {recipe.sourceUrl && (
            <a className="link" href={recipe.sourceUrl} target="_blank" rel="noreferrer">
              See the original recipe ↗
            </a>
          )}
        </section>
      </div>
    </div>
  )
}

function ShareButton({ title }) {
  const [copied, setCopied] = useState(false)
  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      }
    } catch {
      // they closed the share sheet, that's fine
    }
  }
  return (
    <button type="button" className="btn" onClick={share}>
      {copied ? 'Link copied!' : 'Share'}
    </button>
  )
}

function RateIt({ id }) {
  const { ratings, rate } = useAppState()
  const rated = ratings[id]
  const [stars, setStars] = useState(rated ?? 0)
  const [hover, setHover] = useState(0)

  return (
    <section className="panel rate">
      <h2>{rated ? 'Thanks for rating!' : 'Made it? Rate it'}</h2>
      <div className="big-stars" role="radiogroup" aria-label="Your rating" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={stars === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={n <= (hover || stars) ? 'lit' : ''}
            onMouseEnter={() => setHover(n)}
            onClick={() => setStars(n)}
          >
            ★
          </button>
        ))}
      </div>
      <button type="button" className="btn green" disabled={!stars || stars === rated} onClick={() => rate(id, stars)}>
        {rated && stars === rated ? 'Rated' : 'Submit rating'}
      </button>
    </section>
  )
}
