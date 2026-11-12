package com.pantryvision.recipe;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

// Key is forced blank here so this never calls the real Spoonacular, even if your .env has a key.
@SpringBootTest(properties = "pantryvision.recipe-api.api-key=")
@AutoConfigureMockMvc
class RecipeControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void searchWithoutAKeySays503() throws Exception {
		mockMvc.perform(get("/api/recipes/search").param("ingredients", "eggs", "spinach"))
				.andExpect(status().isServiceUnavailable());
	}

	@Test
	void searchNeedsIngredients() throws Exception {
		mockMvc.perform(get("/api/recipes/search")).andExpect(status().isBadRequest());
	}

	@Test
	void negativeOffsetIsRejected() throws Exception {
		mockMvc.perform(get("/api/recipes/search").param("ingredients", "eggs").param("offset", "-3"))
				.andExpect(status().isBadRequest());
	}
}
