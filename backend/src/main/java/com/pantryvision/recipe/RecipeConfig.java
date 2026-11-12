package com.pantryvision.recipe;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/** Turns on the pantryvision.recipe-api.* settings. */
@Configuration
@EnableConfigurationProperties(SpoonacularProperties.class)
class RecipeConfig {
}
