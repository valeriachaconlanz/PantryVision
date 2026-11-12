package com.pantryvision.recipe;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * A recipe the way our frontend wants it (FR-13, FR-14).
 *
 * @param id           Spoonacular's recipe id
 * @param title        recipe name
 * @param image        photo url, can be null
 * @param prepMinutes  prep time, null if the source didn't say
 * @param cookMinutes  cook time, null if the source didn't say
 * @param totalMinutes total time from start to eating
 * @param servings     how many people it feeds
 * @param score        Spoonacular's quality score turned into 0 to 5 (our "reputability" rating)
 * @param likes        how many people liked it on Spoonacular
 * @param source       who made it, like "Foodista" (NFR-11: always credit the source)
 * @param sourceUrl    link to the original recipe
 * @param diets        diets it fits, like "vegetarian"
 * @param ingredients  what you need, and whether you already have it
 * @param steps        the instructions
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record Recipe(
		long id,
		String title,
		String image,
		Integer prepMinutes,
		Integer cookMinutes,
		Integer totalMinutes,
		Integer servings,
		Double score,
		Integer likes,
		String source,
		String sourceUrl,
		List<String> diets,
		List<Ingredient> ingredients,
		List<String> steps) {

	/**
	 * @param text the ingredient line, like "2 tomatoes, chopped"
	 * @param have true if it was in the user's list
	 */
	public record Ingredient(String text, boolean have) {
	}
}
