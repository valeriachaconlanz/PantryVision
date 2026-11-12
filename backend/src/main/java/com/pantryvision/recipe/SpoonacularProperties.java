package com.pantryvision.recipe;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Settings for the Spoonacular recipe API. The key comes from RECIPE_API_KEY in .env.
 *
 * @param apiKey  our Spoonacular key (blank means recipe search is turned off)
 * @param baseUrl where the API lives, only changed in tests
 */
@ConfigurationProperties("pantryvision.recipe-api")
public record SpoonacularProperties(String apiKey, String baseUrl) {

	public SpoonacularProperties {
		if (baseUrl == null || baseUrl.isBlank()) {
			baseUrl = "https://api.spoonacular.com";
		}
	}

	public boolean hasKey() {
		return apiKey != null && !apiKey.isBlank();
	}
}
