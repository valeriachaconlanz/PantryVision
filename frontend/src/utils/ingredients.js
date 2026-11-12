// Turns "eggs, spinach and 2 tomatoes" into ["Eggs", "Spinach", "2 tomatoes"].
export function parseIngredients(text) {
  return text
    .split(/,|\n|\band\b/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .filter((s, i, all) => all.findIndex((o) => o.toLowerCase() === s.toLowerCase()) === i)
}
