package com.pantryvision.recipe;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

/**
 * Recipe search and details, backed by Spoonacular (FR-10 to FR-14, FR-17, FR-18).
 *
 * Example: GET /api/recipes/search?ingredients=eggs,spinach&meal=Dinner&diets=Vegetarian&allergies=Peanuts&maxMinutes=30
 */
@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

	private final SpoonacularClient spoonacular;

	public RecipeController(SpoonacularClient spoonacular) {
		this.spoonacular = spoonacular;
	}

	/** 3 recipes using what you have. Pass nextOffset back as offset for "show 3 more". */
	@GetMapping("/search")
	public RecipePage search(
			@RequestParam @NotEmpty @Size(max = 30) List<String> ingredients,
			@RequestParam(required = false) String meal,
			@RequestParam(required = false) List<String> diets,
			@RequestParam(required = false) List<String> allergies,
			@RequestParam(required = false) @Min(1) @Max(1440) Integer maxMinutes,
			@RequestParam(defaultValue = "0") @Min(0) @Max(900) int offset) {
		return spoonacular.search(new RecipeQuery(ingredients, meal, diets, allergies, maxMinutes, offset));
	}

	/** One recipe with ingredients and steps. "have" marks which ingredients you already have. */
	@GetMapping("/{id}")
	public Recipe get(@PathVariable @Min(1) long id, @RequestParam(required = false) List<String> have) {
		return spoonacular.get(id, have == null ? List.of() : have);
	}
}
