import { Link } from 'react-router-dom'

// Little cartoon plate used when a recipe doesn't have a photo.
export function Plate({ recipe, small = false }) {
  if (recipe.image) {
    return <div className={`plate photo ${small ? 'small' : ''}`} style={{ backgroundImage: `url(${recipe.image})` }} />
  }
  const spots = [
    { left: '44%', top: '38%' },
    { left: '52%', top: '50%' },
    { left: '40%', top: '52%' },
  ]
  return (
    <div className={`plate ${small ? 'small' : ''}`} style={{ background: recipe.color ?? 'var(--yolk)' }} aria-hidden="true">
      {(recipe.dots ?? []).map((color, i) => (
        <i key={i} style={{ ...spots[i % spots.length], background: color }} />
      ))}
    </div>
  )
}

export function Stars({ rating }) {
  const full = Math.round(rating)
  return (
    <span aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)} {rating.toFixed(1)}
    </span>
  )
}

// FR-13: every card shows prep time, cook time, user rating, and where it's from.
export default function RecipeCard({ recipe, kicker }) {
  return (
    <Link className="rcard" to={`/recipes/${recipe.id}`}>
      <Plate recipe={recipe} />
      <div className="body">
        {kicker && <div className="kicker">{kicker}</div>}
        <h3>{recipe.title}</h3>
        <div className="meta">
          <span className="tag">Prep {recipe.prepMinutes} min</span>
          <span className="tag">Cook {recipe.cookMinutes} min</span>
        </div>
        <div className="meta">
          <span className="tag yolk">
            <Stars rating={recipe.rating} />
          </span>
          {recipe.ratingCount} ratings
        </div>
        <div className="meta">
          {recipe.trusted ? (
            <span className="tag green">Trusted source</span>
          ) : (
            <span className="tag">Made by PantryVision AI</span>
          )}
        </div>
        <div className="src">
          {recipe.trusted ? `From ${recipe.source}` : 'Generated for you, double check the cook time'}
        </div>
      </div>
    </Link>
  )
}
