import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchRecipes } from '../api/recipes.js'
import RecipeCard from '../components/RecipeCard.jsx'
import useAppState from '../hooks/useAppState.js'
import { NO_DIET } from '../data/options.js'
import './Recipes.css'

const PLURAL = { Breakfast: 'breakfasts', Lunch: 'lunches', Dinner: 'dinners', Dessert: 'desserts' }

// FR-11 to FR-13, FR-18: 3 real recipes at a time, with the filters you picked.
export default function Recipes() {
  const { search, setSearch, prefs } = useAppState()
  const [adding, setAdding] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  async function load(next, offset) {
    setLoading(true)
    setError(null)
    try {
      const page = await searchRecipes(next, prefs, offset)
      if (!alive.current) return
      setSearch({ ...next, results: page.results, offset: page.offset, nextOffset: page.nextOffset, total: page.totalResults })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      if (alive.current) setError(err.message)
    } finally {
      if (alive.current) setLoading(false)
    }
  }

  // if we have ingredients but never got results (like an old saved search), ask once
  const needsFirstLoad = search.ingredients.length > 0 && search.results == null
  useEffect(() => {
    if (needsFirstLoad) load(search, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needsFirstLoad])

  // changing your ingredients starts the search over from the first 3
  function changeIngredients(ingredients) {
    if (!ingredients.length) return
    load({ ...search, ingredients }, 0)
  }

  function addIngredient(e) {
    e.preventDefault()
    const name = adding.trim()
    setAdding('')
    if (!name || search.ingredients.some((i) => i.toLowerCase() === name.toLowerCase())) return
    changeIngredients([...search.ingredients, name[0].toUpperCase() + name.slice(1)])
  }

  if (!search.ingredients.length) {
    return (
      <div className="empty">
        <h1>No recipes yet</h1>
        <p className="lede">Show us what's in your fridge first.</p>
        <Link className="btn big red" to="/search">
          Start a search
        </Link>
      </div>
    )
  }

  const recipes = search.results ?? []
  const filters = [search.maxMinutes && `Under ${search.maxMinutes} min`].filter(Boolean)
  const dietTags = [...prefs.diets.filter((d) => d !== NO_DIET), ...prefs.allergies.map((a) => `No ${a.toLowerCase()}`)]
  const hasMore = search.nextOffset < search.total

  return (
    <div className="recipes">
      <h1>
        {recipes.length || 'No'} {PLURAL[search.meal] ?? 'recipes'} for you
      </h1>
      <p className="lede" style={{ marginBottom: 14 }}>
        Based on what you have. Missed something? Add it and we'll look again.
      </p>

      <div className="chips have">
        {search.ingredients.map((name) => (
          <button
            key={name}
            type="button"
            className="chip on"
            disabled={loading || search.ingredients.length === 1}
            onClick={() => changeIngredients(search.ingredients.filter((i) => i !== name))}
            aria-label={`Remove ${name}`}
          >
            {name} <span className="x">✕</span>
          </button>
        ))}
        <form onSubmit={addIngredient} className="add-ingredient">
          <label className="sr-only" htmlFor="add-ingredient">
            Add an ingredient
          </label>
          <input
            id="add-ingredient"
            className="chip dashed"
            placeholder="+ Add"
            value={adding}
            disabled={loading}
            onChange={(e) => setAdding(e.target.value)}
          />
        </form>
      </div>

      {(filters.length > 0 || dietTags.length > 0) && (
        <div className="filters">
          <b>Filters:</b>
          {filters.map((f) => (
            <span key={f} className="tag yolk">
              {f}
            </span>
          ))}
          {dietTags.map((f) => (
            <span key={f} className="tag green">
              {f}
            </span>
          ))}
          <Link className="link" to="/search">
            Edit
          </Link>
        </div>
      )}

      {error && (
        <p className="note error-box" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="loading-line">Finding recipes...</p>
      ) : recipes.length === 0 ? (
        <div className="panel no-results">
          <h2>Couldn't find anything</h2>
          <p>Try taking out an ingredient, giving yourself more time, or loosening your diet filters.</p>
          <Link className="btn red" to="/search">
            Change my search
          </Link>
        </div>
      ) : (
        <div className="cards">
          {recipes.map((r, i) => (
            <RecipeCard key={r.id} recipe={r} kicker={`Recipe ${search.offset + i + 1} of ${search.total}`} />
          ))}
        </div>
      )}

      {recipes.length > 0 && (
        <div className="more">
          <div className="row" style={{ justifyContent: 'center' }}>
            {search.offset > 0 && (
              <button type="button" className="btn" disabled={loading} onClick={() => load(search, Math.max(0, search.offset - 3))}>
                ← Last 3
              </button>
            )}
            {hasMore && (
              <button type="button" className="btn big" disabled={loading} onClick={() => load(search, search.nextOffset)}>
                Nah, show me 3 more
              </button>
            )}
          </div>
          <p className="muted">
            {hasMore ? `${search.total} recipes matched, you're seeing ${search.offset + 1} to ${search.nextOffset}.` : "That's all of them."}
          </p>
        </div>
      )}
    </div>
  )
}
