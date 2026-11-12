// Choices the user can pick from. These come straight from the requirements doc.

export const DIETS = [
  'Low carb',
  'Keto',
  'Paleo',
  'Vegan',
  'Vegetarian',
  'High macro',
  'No seed oils',
]

// picking this one clears the others
export const NO_DIET = 'None, I eat everything'

export const COMMON_ALLERGIES = ['Peanuts', 'Tree nuts', 'Dairy', 'Eggs', 'Gluten', 'Shellfish', 'Soy']

export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Dessert']

export const TOOLS = ['Stovetop', 'Oven', 'Air fryer', 'Microwave']

export const TIMES = [
  { label: '15 min', minutes: 15 },
  { label: '30 min', minutes: 30 },
  { label: '1 hr', minutes: 60 },
  { label: 'Whatever', minutes: null },
]

// guess the meal from the time of day (NH-3)
export function mealForHour(hour) {
  if (hour >= 5 && hour < 11) return 'Breakfast'
  if (hour >= 11 && hour < 16) return 'Lunch'
  if (hour >= 16 && hour < 22) return 'Dinner'
  return 'Dessert'
}
