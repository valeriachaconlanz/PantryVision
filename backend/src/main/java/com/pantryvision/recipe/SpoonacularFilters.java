package com.pantryvision.recipe;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Turns our diet / allergy / meal names into Spoonacular complexSearch params.
 * Spoonacular docs: https://spoonacular.com/food-api/docs#Search-Recipes-Complex
 */
final class SpoonacularFilters {

	/** Diets Spoonacular supports directly. */
	private static final Map<String, String> DIETS = Map.of(
			"keto", "ketogenic",
			"paleo", "paleo",
			"vegan", "vegan",
			"vegetarian", "vegetarian");

	/** Allergies that match a Spoonacular "intolerance". Anything else goes in excludeIngredients. */
	private static final Map<String, String> INTOLERANCES = Map.ofEntries(
			Map.entry("peanuts", "peanut"),
			Map.entry("peanut", "peanut"),
			Map.entry("tree nuts", "tree nut"),
			Map.entry("dairy", "dairy"),
			Map.entry("eggs", "egg"),
			Map.entry("egg", "egg"),
			Map.entry("gluten", "gluten"),
			Map.entry("shellfish", "shellfish"),
			Map.entry("soy", "soy"),
			Map.entry("sesame", "sesame"),
			Map.entry("wheat", "wheat"),
			Map.entry("seafood", "seafood"));

	/** Spoonacular doesn't have a "no seed oils" diet, so we just exclude the oils. */
	static final List<String> SEED_OILS = List.of("canola oil", "vegetable oil", "soybean oil", "sunflower oil",
			"corn oil", "cottonseed oil", "grapeseed oil", "safflower oil", "rice bran oil");

	/** "Low carb" and "high macro" aren't Spoonacular diets either, so we use nutrient limits per serving. */
	static final int LOW_CARB_MAX_CARBS = 30;
	static final int HIGH_MACRO_MIN_PROTEIN = 25;

	private SpoonacularFilters() {
	}

	static Map<String, String> toParams(RecipeQuery query, int number) {
		Map<String, String> params = new LinkedHashMap<>();
		params.put("includeIngredients", String.join(",", query.ingredients()));
		params.put("sort", "max-used-ingredients");
		params.put("ignorePantry", "true");
		params.put("fillIngredients", "true");
		params.put("addRecipeInformation", "true");
		params.put("addRecipeInstructions", "true");
		params.put("instructionsRequired", "true");
		params.put("number", String.valueOf(number));
		params.put("offset", String.valueOf(Math.max(0, query.offset())));

		String type = mealType(query.meal());
		if (type != null) {
			params.put("type", type);
		}
		if (query.maxMinutes() != null && query.maxMinutes() > 0) {
			params.put("maxReadyTime", String.valueOf(query.maxMinutes()));
		}

		List<String> diets = new ArrayList<>();
		Set<String> exclude = new LinkedHashSet<>();
		for (String diet : query.diets()) {
			String key = normalize(diet);
			if (DIETS.containsKey(key)) {
				diets.add(DIETS.get(key));
			} else if (key.equals("low carb")) {
				params.put("maxCarbs", String.valueOf(LOW_CARB_MAX_CARBS));
			} else if (key.equals("high macro")) {
				params.put("minProtein", String.valueOf(HIGH_MACRO_MIN_PROTEIN));
			} else if (key.equals("no seed oils")) {
				exclude.addAll(SEED_OILS);
			}
		}
		if (!diets.isEmpty()) {
			// comma means the recipe has to match all of them
			params.put("diet", String.join(",", diets));
		}

		Set<String> intolerances = new LinkedHashSet<>();
		for (String allergy : query.allergies()) {
			String key = normalize(allergy);
			if (key.isEmpty()) {
				continue;
			}
			if (INTOLERANCES.containsKey(key)) {
				intolerances.add(INTOLERANCES.get(key));
			} else {
				exclude.add(key);
			}
		}
		if (!intolerances.isEmpty()) {
			params.put("intolerances", String.join(",", intolerances));
		}
		if (!exclude.isEmpty()) {
			params.put("excludeIngredients", String.join(",", exclude));
		}
		return params;
	}

	static String mealType(String meal) {
		if (meal == null) {
			return null;
		}
		return switch (normalize(meal)) {
			case "breakfast" -> "breakfast";
			case "lunch", "dinner" -> "main course";
			case "dessert" -> "dessert";
			default -> null;
		};
	}

	private static String normalize(String s) {
		return s == null ? "" : s.trim().toLowerCase(Locale.ROOT);
	}
}
