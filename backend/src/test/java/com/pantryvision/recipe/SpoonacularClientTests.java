package com.pantryvision.recipe;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

// Uses a fake Spoonacular server so tests don't use up our daily API calls.
class SpoonacularClientTests {

	private static final String SEARCH_JSON = """
			{
			  "results": [{
			    "id": 715415,
			    "title": "Spinach and Feta Shakshuka",
			    "image": "https://img.spoonacular.com/recipes/715415-312x231.jpg",
			    "readyInMinutes": 25,
			    "preparationMinutes": 5,
			    "cookingMinutes": null,
			    "servings": 2,
			    "spoonacularScore": 92.4,
			    "aggregateLikes": 210,
			    "sourceName": "Foodista",
			    "sourceUrl": "https://www.foodista.com/shakshuka",
			    "diets": ["vegetarian"],
			    "cuisines": [],
			    "usedIngredients": [{"name": "eggs", "original": "4 eggs"}, {"name": "spinach", "original": "2 cups spinach"}],
			    "missedIngredients": [{"name": "cumin", "original": "1 tsp cumin"}],
			    "analyzedInstructions": [{"name": "", "steps": [
			      {"number": 1, "step": "Cook the onion."},
			      {"number": 2, "step": "Crack in the eggs."}
			    ]}]
			  }],
			  "offset": 3,
			  "number": 3,
			  "totalResults": 57
			}
			""";

	private static final String INFO_JSON = """
			{
			  "id": 715415,
			  "title": "Spinach and Feta Shakshuka",
			  "readyInMinutes": 25,
			  "preparationMinutes": -1,
			  "cookingMinutes": -1,
			  "servings": 2,
			  "spoonacularScore": 92.4,
			  "aggregateLikes": 210,
			  "sourceName": "Foodista",
			  "sourceUrl": "https://www.foodista.com/shakshuka",
			  "diets": ["vegetarian"],
			  "extendedIngredients": [
			    {"name": "eggs", "original": "4 eggs"},
			    {"name": "tomato", "original": "2 tomatoes, chopped"},
			    {"name": "cumin", "original": "1 tsp cumin"}
			  ],
			  "analyzedInstructions": [{"steps": [{"number": 1, "step": "Do the thing."}]}]
			}
			""";

	private MockRestServiceServer server;
	private SpoonacularClient client;

	@BeforeEach
	void setUp() {
		RestClient.Builder builder = RestClient.builder();
		server = MockRestServiceServer.bindTo(builder).build();
		client = new SpoonacularClient(new SpoonacularProperties("test-key", "https://spoon.test"), builder);
	}

	@Test
	void searchSendsFiltersAndMapsTheResults() {
		server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://spoon.test/recipes/complexSearch")))
				.andExpect(header("x-api-key", "test-key"))
				.andExpect(queryParam("includeIngredients", "eggs,spinach"))
				.andExpect(queryParam("type", "main%20course"))
				.andExpect(queryParam("diet", "vegetarian"))
				.andExpect(queryParam("intolerances", "peanut"))
				.andExpect(queryParam("maxReadyTime", "30"))
				.andExpect(queryParam("number", "3"))
				.andExpect(queryParam("offset", "3"))
				.andRespond(withSuccess(SEARCH_JSON, MediaType.APPLICATION_JSON));

		RecipePage page = client.search(new RecipeQuery(List.of("eggs", "spinach"), "Dinner", List.of("Vegetarian"),
				List.of("Peanuts"), 30, 3));

		server.verify();
		assertThat(page.offset()).isEqualTo(3);
		assertThat(page.nextOffset()).isEqualTo(4);
		assertThat(page.totalResults()).isEqualTo(57);
		Recipe r = page.results().get(0);
		assertThat(r.id()).isEqualTo(715415);
		assertThat(r.prepMinutes()).isEqualTo(5);
		assertThat(r.cookMinutes()).isEqualTo(20); // total 25 minus prep 5, since cook time was missing
		assertThat(r.score()).isEqualTo(4.6);
		assertThat(r.likes()).isEqualTo(210);
		assertThat(r.source()).isEqualTo("Foodista");
		assertThat(r.ingredients()).containsExactly(
				new Recipe.Ingredient("4 eggs", true),
				new Recipe.Ingredient("2 cups spinach", true),
				new Recipe.Ingredient("1 tsp cumin", false));
		assertThat(r.steps()).containsExactly("Cook the onion.", "Crack in the eggs.");
	}

	@Test
	void getMarksWhatTheUserHas() {
		server.expect(requestTo("https://spoon.test/recipes/715415/information?includeNutrition=false"))
				.andRespond(withSuccess(INFO_JSON, MediaType.APPLICATION_JSON));

		Recipe r = client.get(715415, List.of("Eggs", "Tomatoes"));

		assertThat(r.prepMinutes()).isNull();
		assertThat(r.cookMinutes()).isEqualTo(25);
		assertThat(r.ingredients()).extracting(Recipe.Ingredient::have).containsExactly(true, true, false);
		assertThat(r.steps()).containsExactly("Do the thing.");
	}

	@Test
	void dailyLimitBecomesAFriendlyError() {
		server.expect(requestTo(org.hamcrest.Matchers.startsWith("https://spoon.test/recipes/complexSearch")))
				.andRespond(withStatus(HttpStatus.PAYMENT_REQUIRED));

		assertThatThrownBy(() -> client.search(new RecipeQuery(List.of("eggs"), null, null, null, null, 0)))
				.isInstanceOf(ResponseStatusException.class)
				.hasMessageContaining("daily limit");
	}

	@Test
	void unknownRecipeIs404() {
		server.expect(requestTo("https://spoon.test/recipes/1/information?includeNutrition=false"))
				.andRespond(withStatus(HttpStatus.NOT_FOUND));

		assertThatThrownBy(() -> client.get(1, List.of()))
				.isInstanceOfSatisfying(ResponseStatusException.class,
						e -> assertThat(e.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND));
	}

	@Test
	void noKeyMeansNoCall() {
		SpoonacularClient noKey = new SpoonacularClient(new SpoonacularProperties("", null), RestClient.builder());

		assertThatThrownBy(() -> noKey.search(new RecipeQuery(List.of("eggs"), null, null, null, null, 0)))
				.isInstanceOfSatisfying(ResponseStatusException.class,
						e -> assertThat(e.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE));
	}
}
