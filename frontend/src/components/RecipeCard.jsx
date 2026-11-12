import { Link } from 'react-router-dom'
import { biggerImage, likesText } from '../utils/recipeText.js'

const PLATE_COLORS = ['var(--tomato)', 'var(--leaf)', 'var(--sky)', 'var(--yolk)']
const DOT_COLORS = ['#fff', 'var(--leaf)', 'var(--yolk)', 'var(--tomato)']

// The recipe photo, or a little cartoon plate if there isn't one.
export function Plate({ recipe, small = false, big = false }) {
  if (recipe.image) {
    return (
      <div
        className={`plate photo ${small ? 'small' : ''}`}
        style={{ backgroundImage: `url(${big ? biggerImage(recipe.image) : recipe.image})` }}
        role="img"
        aria-label={recipe.title}
      />
    )
  }
  const n = Number(String(recipe.id).replace(/\D/g, '')) || 0
  const spots = [
    { left: '44%', top: '38%' },
    { left: '52%', top: '50%' },
    { left: '40%', top: '52%' },
  ]
  return (
    <div className={`plate ${small ? 'small' : ''}`} style={{ background: PLATE_COLORS[n % 4] }} aria-hidden="true">
      {spots.map((spot, i) => (
        <i key={i} style={{ ...spot, background: DOT_COLORS[(n + i) % 4] }} />
      ))}
    </div>
  )
}

export function Stars({ score }) {
  const full = Math.round(score)
  return (
    <span aria-label={`${score} out of 5`}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)} {score.toFixed(1)}
    </span>
  )
}

// FR-13: prep time, cook time, rating, and where it's from (NFR-11).
export default function RecipeCard({ recipe, kicker, to }) {
  const have = recipe.ingredients?.filter((i) => i.have).length ?? 0
  const total = recipe.ingredients?.length ?? 0

  return (
    <Link className="rcard" to={to ?? `/recipes/${recipe.id}`}>
      <Plate recipe={recipe} />
      <div className="body">
        {kicker && <div className="kicker">{kicker}</div>}
        <h3>{recipe.title}</h3>
        <div className="meta">
          {recipe.prepMinutes != null && <span className="tag">Prep {recipe.prepMinutes} min</span>}
          {recipe.cookMinutes != null && <span className="tag">Cook {recipe.cookMinutes} min</span>}
          {recipe.prepMinutes == null && recipe.cookMinutes == null && recipe.totalMinutes != null && (
            <span className="tag">Ready in {recipe.totalMinutes} min</span>
          )}
        </div>
        <div className="meta">
          {recipe.score != null && (
            <span className="tag yolk">
              <Stars score={recipe.score} />
            </span>
          )}
          {recipe.likes != null && likesText(recipe.likes)}
        </div>
        {total > 0 && (
          <div className="meta">
            <span className={`tag ${have === total ? 'green' : ''}`}>
              You have {have} of {total} ingredients
            </span>
          </div>
        )}
        {recipe.source && <div className="src">From {recipe.source}</div>}
      </div>
    </Link>
  )
}
