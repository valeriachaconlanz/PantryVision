import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plate } from '../components/RecipeCard.jsx'
import useAppState from '../hooks/useAppState.js'
import { MEALS } from '../data/options.js'
import './Library.css'

// FR-20: saved recipes, sorted by meal type.
export default function Library() {
  const { saved } = useAppState()
  const [filter, setFilter] = useState('All')

  // TODO: load saved recipes from the backend (library package)
  // old saves from the sample recipes don't have a title, so skip those
  const recipes = saved.filter((r) => r.title).sort((a, b) => b.savedAt.localeCompare(a.savedAt))

  const count = (meal) => recipes.filter((r) => r.meal === meal).length
  const shown = MEALS.filter((m) => (filter === 'All' || filter === m) && count(m) > 0)

  return (
    <div className="library">
      <h1>Your library</h1>
      <p className="lede">Everything you saved, sorted by meal.</p>

      {recipes.length === 0 ? (
        <div className="panel empty-library">
          <h2>Nothing saved yet</h2>
          <p>When you find a recipe you like, hit "Save to library" and it'll show up here.</p>
          <Link className="btn red" to="/search">
            Find something to cook
          </Link>
        </div>
      ) : (
        <>
          <div className="chips types" role="group" aria-label="Filter by meal">
            {['All', ...MEALS].map((m) => (
              <button key={m} type="button" className="chip" aria-pressed={filter === m} onClick={() => setFilter(m)}>
                {m} <b>{m === 'All' ? recipes.length : count(m)}</b>
              </button>
            ))}
          </div>

          {shown.length === 0 && <p className="muted">No {filter.toLowerCase()} recipes saved yet.</p>}

          {shown.map((meal) => (
            <section key={meal}>
              <h2 className="section-title">{meal}</h2>
              <div className="cards four">
                {recipes
                  .filter((r) => r.meal === meal)
                  .map((r) => (
                    <Link key={r.id} className="rcard" to={`/recipes/${r.id}`}>
                      <Plate recipe={r} small />
                      <div className="body">
                        <h3>{r.title}</h3>
                        <div className="meta">
                          {r.totalMinutes != null && <span className="tag">{r.totalMinutes} min</span>}
                          {r.score != null && <span className="tag yolk">★ {r.score.toFixed(1)}</span>}
                        </div>
                        <div className="saved-on">
                          Saved {new Date(r.savedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  )
}
