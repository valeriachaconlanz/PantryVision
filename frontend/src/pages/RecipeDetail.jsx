import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAppState from '../hooks/useAppState.js'
import { findRecipe } from '../data/sampleRecipes.js'
import NotFound from './NotFound.jsx'
import './RecipeDetail.css'

// FR-14, FR-15: ingredients, steps, where it's from, and rate it.
export default function RecipeDetail() {
  const { id } = useParams()
  const { isSaved, toggleSaved, ratings, rate } = useAppState()
  // TODO: load from the backend instead of the sample list
  const recipe = findRecipe(id)
  const [stars, setStars] = useState(ratings[id] ?? 0)
  const [hover, setHover] = useState(0)
  const [copied, setCopied] = useState(false)

  if (!recipe) return <NotFound inApp />

  const saved = isSaved(recipe.id)
  const rated = ratings[recipe.id]

  async function share() {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: recipe.title, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
      }
    } catch {
      // they closed the share sheet, that's fine
    }
  }

  return (
    <div className="recipe-detail">
      <Link className="back link" to="/recipes">
        ← Back to my 3 recipes
      </Link>

      <div className="top">
        <div>
          <h1>{recipe.title}</h1>
          <div className="meta">
            <span className="tag">Prep {recipe.prepMinutes} min</span>
            <span className="tag">Cook {recipe.cookMinutes} min</span>
            <span className="tag">Serves {recipe.servings}</span>
            <span className="tag yolk">
              ★ {recipe.rating.toFixed(1)} ({recipe.ratingCount})
            </span>
            {recipe.tags.map((t) => (
              <span key={t} className="tag green">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="actions">
          <button type="button" className="btn" onClick={share}>
            {copied ? 'Link copied!' : 'Share'}
          </button>
          <button type="button" className={`btn ${saved ? 'green' : 'red'}`} onClick={() => toggleSaved(recipe)}>
            {saved ? 'Saved ✓' : 'Save to library'}
          </button>
        </div>
      </div>

      <div className="recipe-card">
        <aside>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ing) => (
              <li key={ing.text} className={ing.have ? '' : 'need'}>
                {ing.text} <small>{ing.have ? 'HAVE IT' : 'NEED'}</small>
              </li>
            ))}
          </ul>
        </aside>
        <div className="steps">
          <h2>Steps</h2>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step}>
                <div>{step}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="bottom">
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
          {/* TODO: send the rating to the backend (rating package) */}
          <button type="button" className="btn green" disabled={!stars || stars === rated} onClick={() => rate(recipe.id, stars)}>
            {rated && stars === rated ? 'Rated' : 'Submit rating'}
          </button>
        </section>
        <section className="panel">
          <h2>Where this is from</h2>
          {recipe.trusted ? (
            <>
              <p>
                Original recipe by <b>{recipe.source}</b>. We changed it a little to fit what you have.
              </p>
              <a className="link" href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                See the original recipe ↗
              </a>
            </>
          ) : (
            <p>
              Our AI made this one for you, so it hasn't been tested by a real cook yet. Double check the times and use
              your judgment.
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
