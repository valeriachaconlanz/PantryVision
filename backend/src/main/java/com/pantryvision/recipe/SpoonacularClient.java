package com.pantryvision.recipe;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.function.Supplier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriBuilder;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import com.pantryvision.common.UserFacingException;

/**
 * Talks to the Spoonacular API (FR-10). The key only lives here on the backend,
 * the frontend never sees it.
 */
@Component
public class SpoonacularClient {

	/** FR-11: we show 3 recipes at a time. */
	static final int PAGE_SIZE = 3;

	private final SpoonacularProperties properties;
	private final RestClient http;

	@Autowired
	public SpoonacularClient(SpoonacularProperties properties) {
		this(properties, RestClient.builder());
	}

	// tests pass in a builder hooked up to a fake server
	SpoonacularClient(SpoonacularProperties properties, RestClient.Builder builder) {
		this.properties = properties;
		this.http = builder
				.baseUrl(properties.baseUrl())
				.defaultHeader("x-api-key", Objects.requireNonNullElse(properties.apiKey(), ""))
				.build();
	}

	/** Finds 3 recipes that use as many of the user's ingredients as possible. */
	public RecipePage search(RecipeQuery query) {
		requireKey();
		Map<String, String> params = SpoonacularFilters.toParams(query, PAGE_SIZE);
		SearchResponse response = call(() -> http.get()
				.uri(b -> withParams(b.path("/recipes/complexSearch"), params))
				.retrieve()
				.body(SearchResponse.class));

		List<Recipe> recipes = response == null || response.results() == null ? List.of()
				: response.results().stream().map(SpoonacularClient::fromSearchResult).toList();
		int offset = Math.max(0, query.offset());
		int total = response == null ? 0 : response.totalResults();
		return new RecipePage(recipes, offset, offset + recipes.size(), total);
	}

	/** Full recipe for the detail page. "have" is the user's ingredients so we can mark what they already have. */
	public Recipe get(long id, Collection<String> have) {
		requireKey();
		RecipeInfo info = call(() -> http.get()
				.uri(b -> b.path("/recipes/{id}/information").queryParam("includeNutrition", "false").build(id))
				.retrieve()
				.body(RecipeInfo.class));
		if (info == null) {
			throw new UserFacingException(HttpStatus.NOT_FOUND, "Recipe not found");
		}
		List<Recipe.Ingredient> ingredients = info.extendedIngredients() == null ? List.of()
				: info.extendedIngredients().stream()
						.map(i -> new Recipe.Ingredient(i.original(), userHas(i.name(), have)))
						.toList();
		return toRecipe(info.id(), info.title(), info.image(), info.preparationMinutes(), info.cookingMinutes(),
				info.readyInMinutes(), info.servings(), info.spoonacularScore(), info.aggregateLikes(),
				info.sourceName(), info.sourceUrl(), info.diets(), ingredients, info.analyzedInstructions());
	}

	private static Recipe fromSearchResult(SearchResult r) {
		List<Recipe.Ingredient> ingredients = new ArrayList<>();
		if (r.usedIngredients() != null) {
			r.usedIngredients().forEach(i -> ingredients.add(new Recipe.Ingredient(i.original(), true)));
		}
		if (r.missedIngredients() != null) {
			r.missedIngredients().forEach(i -> ingredients.add(new Recipe.Ingredient(i.original(), false)));
		}
		return toRecipe(r.id(), r.title(), r.image(), r.preparationMinutes(), r.cookingMinutes(), r.readyInMinutes(),
				r.servings(), r.spoonacularScore(), r.aggregateLikes(), r.sourceName(), r.sourceUrl(), r.diets(),
				ingredients, r.analyzedInstructions());
	}

	private static Recipe toRecipe(long id, String title, String image, Integer prep, Integer cook, Integer ready,
			Integer servings, Double score, Integer likes, String sourceName, String sourceUrl, List<String> diets,
			List<Recipe.Ingredient> ingredients, List<Instructions> instructions) {
		Integer prepMinutes = positive(prep);
		Integer cookMinutes = positive(cook);
		Integer total = positive(ready);
		// Spoonacular often leaves prep/cook blank but always has the total
		if (cookMinutes == null && total != null) {
			cookMinutes = prepMinutes == null ? total : Math.max(0, total - prepMinutes);
		}
		Double rating = score == null ? null : Math.round(score / 20.0 * 10) / 10.0;
		List<String> steps = instructions == null ? List.of()
				: instructions.stream()
						.filter(block -> block.steps() != null)
						.flatMap(block -> block.steps().stream())
						.map(Step::step)
						.filter(s -> s != null && !s.isBlank())
						.toList();
		return new Recipe(id, title, image, prepMinutes, cookMinutes, total, servings, rating, likes,
				sourceName, sourceUrl, diets == null ? List.of() : diets, ingredients, steps);
	}

	private static Integer positive(Integer n) {
		return n == null || n <= 0 ? null : n;
	}

	static boolean userHas(String ingredientName, Collection<String> have) {
		if (ingredientName == null || have == null) {
			return false;
		}
		String name = ingredientName.toLowerCase(Locale.ROOT);
		return have.stream()
				.map(h -> h.trim().toLowerCase(Locale.ROOT))
				.filter(h -> !h.isEmpty())
				.anyMatch(h -> name.contains(h) || h.contains(name) || name.contains(singular(h)));
	}

	private static String singular(String word) {
		if (word.endsWith("oes")) {
			return word.substring(0, word.length() - 2);
		}
		return word.endsWith("s") ? word.substring(0, word.length() - 1) : word;
	}

	private static URI withParams(UriBuilder builder, Map<String, String> params) {
		params.forEach(builder::queryParam);
		return builder.build();
	}

	private void requireKey() {
		if (!properties.hasKey()) {
			throw new UserFacingException(HttpStatus.SERVICE_UNAVAILABLE,
					"Recipe search is off because RECIPE_API_KEY isn't set in .env");
		}
	}

	private static <T> T call(Supplier<T> request) {
		try {
			return request.get();
		} catch (HttpClientErrorException e) {
			HttpStatus status = HttpStatus.resolve(e.getStatusCode().value());
			if (status == HttpStatus.UNAUTHORIZED || status == HttpStatus.FORBIDDEN) {
				throw new UserFacingException(HttpStatus.SERVICE_UNAVAILABLE, "Spoonacular rejected our API key");
			}
			if (status == HttpStatus.PAYMENT_REQUIRED || status == HttpStatus.TOO_MANY_REQUESTS) {
				throw new UserFacingException(HttpStatus.SERVICE_UNAVAILABLE,
						"We hit Spoonacular's daily limit, try again tomorrow");
			}
			if (status == HttpStatus.NOT_FOUND) {
				throw new UserFacingException(HttpStatus.NOT_FOUND, "Recipe not found");
			}
			throw new UserFacingException(HttpStatus.BAD_GATEWAY, "Spoonacular didn't like that request");
		} catch (RestClientException e) {
			throw new UserFacingException(HttpStatus.BAD_GATEWAY, "Couldn't reach Spoonacular", e);
		}
	}

	// What Spoonacular sends back. We only list the fields we use.

	@JsonIgnoreProperties(ignoreUnknown = true)
	record SearchResponse(List<SearchResult> results, int offset, int number, int totalResults) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	record SearchResult(long id, String title, String image, Integer readyInMinutes, Integer preparationMinutes,
			Integer cookingMinutes, Integer servings, Double spoonacularScore, Integer aggregateLikes,
			String sourceName, String sourceUrl, List<String> diets, List<IngredientInfo> usedIngredients,
			List<IngredientInfo> missedIngredients, List<Instructions> analyzedInstructions) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	record RecipeInfo(long id, String title, String image, Integer readyInMinutes, Integer preparationMinutes,
			Integer cookingMinutes, Integer servings, Double spoonacularScore, Integer aggregateLikes,
			String sourceName, String sourceUrl, List<String> diets, List<IngredientInfo> extendedIngredients,
			List<Instructions> analyzedInstructions) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	record IngredientInfo(String name, String original) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	record Instructions(List<Step> steps) {
	}

	@JsonIgnoreProperties(ignoreUnknown = true)
	record Step(int number, String step) {
	}
}
