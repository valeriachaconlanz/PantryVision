import { NO_DIET } from '../data/options.js'
import { apiFetch } from './client.js'

// Calls our backend's recipe endpoints, which talk to Spoonacular.
// Every call uses up some of our daily Spoonacular limit, so the pages
// keep results around instead of asking again.

function listParam(params, name, values) {
  if (values?.length) params.set(name, values.join(','))
}

// FR-11, FR-12, FR-18: 3 recipes for what you have, using your survey prefs
export function searchRecipes({ ingredients, meal, maxMinutes }, prefs, offset = 0) {
  const params = new URLSearchParams()
  listParam(params, 'ingredients', ingredients)
  if (meal) params.set('meal', meal)
  listParam(params, 'diets', prefs.diets.filter((d) => d !== NO_DIET))
  listParam(params, 'allergies', prefs.allergies)
  if (maxMinutes) params.set('maxMinutes', maxMinutes)
  params.set('offset', offset)
  return apiFetch(`/recipes/search?${params}`)
}

const detailCache = new Map()

// FR-14: one recipe. "have" is what's in your kitchen so it can mark what you need.
export async function getRecipe(id, have = []) {
  const key = `${id}|${have.join(',')}`
  if (!detailCache.has(key)) {
    const params = new URLSearchParams()
    listParam(params, 'have', have)
    detailCache.set(
      key,
      apiFetch(`/recipes/${id}?${params}`).catch((err) => {
        detailCache.delete(key)
        throw err
      }),
    )
  }
  return detailCache.get(key)
}
