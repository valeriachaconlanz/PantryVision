// Fake recipes so the pages have something to show.
// TODO: swap these for real results from the backend (Spoonacular + the AI).

export const SAMPLE_INGREDIENTS = ['Eggs', 'Spinach', 'Tomatoes', 'Feta', 'Onion']

export const SAMPLE_RECIPES = [
  {
    id: 'shakshuka',
    title: 'Spinach & feta shakshuka',
    meal: 'Dinner',
    prepMinutes: 5,
    cookMinutes: 15,
    servings: 2,
    rating: 4.6,
    ratingCount: 212,
    trusted: true,
    source: 'Serious Eats',
    sourceUrl: 'https://www.seriouseats.com/',
    color: 'var(--tomato)',
    dots: ['#fff', 'var(--leaf)', 'var(--yolk)'],
    tags: ['Vegetarian'],
    ingredients: [
      { text: '4 eggs', have: true },
      { text: '2 big handfuls spinach', have: true },
      { text: '2 tomatoes, chopped', have: true },
      { text: '1/2 onion, diced', have: true },
      { text: '1/3 cup feta', have: true },
      { text: '1 tbsp olive oil', have: true },
      { text: '1 tsp cumin', have: false },
      { text: 'Salt and pepper', have: true },
    ],
    steps: [
      "Heat the olive oil in a pan on medium. Cook the onion for about 4 minutes until it's soft.",
      'Add the tomatoes and cumin. Cook 5 minutes until it gets saucy, then stir in the spinach until it wilts.',
      'Make 4 little wells in the sauce and crack an egg into each one.',
      'Cover and cook 5 to 6 minutes until the whites are set but the yolks are still runny.',
      'Crumble the feta on top, add salt and pepper, and eat it straight from the pan.',
    ],
  },
  {
    id: 'omelette',
    title: 'Greek spinach omelette',
    meal: 'Breakfast',
    prepMinutes: 5,
    cookMinutes: 8,
    servings: 1,
    rating: 4.2,
    ratingCount: 87,
    trusted: true,
    source: 'Allrecipes',
    sourceUrl: 'https://www.allrecipes.com/',
    color: 'var(--leaf)',
    dots: ['var(--yolk)', '#fff'],
    tags: ['Vegetarian'],
    ingredients: [
      { text: '3 eggs', have: true },
      { text: '1 handful spinach', have: true },
      { text: '2 tbsp feta', have: true },
      { text: '1 tsp butter', have: false },
    ],
    steps: [
      'Whisk the eggs with a pinch of salt.',
      'Melt the butter in a small pan and wilt the spinach.',
      'Pour in the eggs, let them set, then add the feta and fold it over.',
    ],
  },
  {
    id: 'orzo',
    title: 'Baked tomato & feta orzo',
    meal: 'Dinner',
    prepMinutes: 5,
    cookMinutes: 25,
    servings: 3,
    rating: 4.0,
    ratingCount: 9,
    trusted: false,
    source: 'PantryVision AI',
    sourceUrl: null,
    color: 'var(--sky)',
    dots: ['var(--tomato)', 'var(--leaf)', '#fff'],
    tags: ['Vegetarian'],
    ingredients: [
      { text: '1 cup orzo', have: false },
      { text: '2 tomatoes', have: true },
      { text: '1/2 block feta', have: true },
      { text: '2 cups broth or water', have: true },
    ],
    steps: [
      'Heat the oven to 400F.',
      'Put the feta in the middle of a baking dish with the tomatoes around it. Bake 15 minutes.',
      'Stir in the orzo and broth and bake 10 more minutes until the orzo is soft.',
    ],
  },
]

export function findRecipe(id) {
  return SAMPLE_RECIPES.find((r) => r.id === id)
}
