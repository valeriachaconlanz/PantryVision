package com.pantryvision.recipe;

import java.util.List;

/**
 * What the user is searching with. Uses the same words the frontend shows
 * ("Vegetarian", "Peanuts", "Dinner"), {@link SpoonacularFilters} turns them into Spoonacular params.
 *
 * @param ingredients what they have (FR-4 to FR-6)
 * @param meal        Breakfast, Lunch, Dinner or Dessert (FR-7), can be null
 * @param diets       diet prefs from the survey (FR-1, FR-3)
 * @param allergies   allergies from the survey, including custom ones
 * @param maxMinutes  max total time (FR-17), null means no limit
 * @param offset      how many results to skip, for "show 3 more" (FR-12)
 */
public record RecipeQuery(
		List<String> ingredients,
		String meal,
		List<String> diets,
		List<String> allergies,
		Integer maxMinutes,
		int offset) {

	public RecipeQuery {
		ingredients = ingredients == null ? List.of() : List.copyOf(ingredients);
		diets = diets == null ? List.of() : List.copyOf(diets);
		allergies = allergies == null ? List.of() : List.copyOf(allergies);
	}
}
