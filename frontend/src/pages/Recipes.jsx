import { useState } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard.jsx'
import useAppState from '../hooks/useAppState.js'
import { NO_DIET } from '../data/options.js'
import { SAMPLE_RECIPES } from '../data/sampleRecipes.js'
import './Recipes.css'

const PLURAL = { Breakfast: 'breakfasts', Lunch: 'lunches', Dinner: 'dinners', Dessert: 'desserts' }

// FR-11 to FR-13, FR-18: 3 recipes at a time, with the filters you picked.
export default function Recipes() {
  const { search, setSearch, prefs } = useAppState()
  const [adding, setAdding] = useState('')
  const [askedForMore, setAskedForMore] = useState(false)

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

  // TODO: get these from the backend (Spoonacular + AI) using search + prefs
  const recipes = SAMPLE_RECIPES

  function removeIngredient(name) {
    setSearch({ ...search, ingredients: search.ingredients.filter((i) => i !== name) })
  }

  function addIngredient(e) {
    e.preventDefault()
    const name = adding.trim()
    if (name && !search.ingredients.some((i) => i.toLowerCase() === name.toLowerCase())) {
      setSearch({ ...search, ingredients: [...search.ingredients, name[0].toUpperCase() + name.slice(1)] })
    }
    setAdding('')
  }

  const filters = [
    search.maxMinutes && `Under ${search.maxMinutes} min`,
    search.tools.length && search.tools.join(', '),
  ].filter(Boolean)
  const dietTags = [...prefs.diets.filter((d) => d !== NO_DIET), ...prefs.allergies.map((a) => `No ${a.toLowerCase()}`)]

  return (
    <div className="recipes">
      <h1>3 {PLURAL[search.meal] ?? 'recipes'} for you</h1>
      <p className="lede" style={{ marginBottom: 14 }}>
        Based on what we found. Missed something? Add it and we'll redo it.
      </p>

      <div className="chips have">
        {search.ingredients.map((name) => (
          <button key={name} type="button" className="chip on" onClick={() => removeIngredient(name)} aria-label={`Remove ${name}`}>
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

      <div className="cards">
        {recipes.map((r, i) => (
          <RecipeCard key={r.id} recipe={r} kicker={`Recipe ${i + 1} of 3`} />
        ))}
      </div>

      <div className="more">
        <button type="button" className="btn big" onClick={() => setAskedForMore(true)}>
          Nah, show me 3 more
        </button>
        <p className="muted">
          {askedForMore
            ? "This'll work once the recipe search is hooked up to the backend."
            : "You won't see these 3 again in this search."}
        </p>
      </div>
    </div>
  )
}
