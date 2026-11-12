package com.pantryvision.recipe;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;

class SpoonacularFiltersTests {

	private static Map<String, String> params(List<String> diets, List<String> allergies, String meal) {
		return SpoonacularFilters.toParams(new RecipeQuery(List.of("eggs"), meal, diets, allergies, null, 0), 3);
	}

	@Test
	void mapsOurDietsToSpoonacular() {
		Map<String, String> p = params(List.of("Keto", "Vegetarian", "Low carb", "High macro"), List.of(), null);

		assertThat(p).containsEntry("diet", "ketogenic,vegetarian")
				.containsEntry("maxCarbs", "30")
				.containsEntry("minProtein", "25");
	}

	@Test
	void noSeedOilsExcludesTheOils() {
		Map<String, String> p = params(List.of("No seed oils"), List.of(), null);

		assertThat(p.get("excludeIngredients")).contains("canola oil", "vegetable oil", "soybean oil");
	}

	@Test
	void knownAllergiesAreIntolerancesAndCustomOnesAreExcluded() {
		Map<String, String> p = params(List.of(), List.of("Peanuts", "Tree nuts", "Eggs", "Kiwi"), null);

		assertThat(p).containsEntry("intolerances", "peanut,tree nut,egg")
				.containsEntry("excludeIngredients", "kiwi");
	}

	@Test
	void noneMeansNoDietFilter() {
		Map<String, String> p = params(List.of("None, I eat everything"), List.of(), null);

		assertThat(p).doesNotContainKeys("diet", "maxCarbs", "minProtein", "excludeIngredients");
	}

	@Test
	void mealTypes() {
		assertThat(SpoonacularFilters.mealType("Breakfast")).isEqualTo("breakfast");
		assertThat(SpoonacularFilters.mealType("Lunch")).isEqualTo("main course");
		assertThat(SpoonacularFilters.mealType("Dinner")).isEqualTo("main course");
		assertThat(SpoonacularFilters.mealType("Dessert")).isEqualTo("dessert");
		assertThat(SpoonacularFilters.mealType(null)).isNull();
	}

	@Test
	void matchesIngredientsTheUserHas() {
		assertThat(SpoonacularClient.userHas("tomato", List.of("Tomatoes"))).isTrue();
		assertThat(SpoonacularClient.userHas("cumin", List.of("Tomatoes"))).isFalse();
	}
}
