package com.pantryvision.recipe;

import java.util.List;

/**
 * One batch of recipes (3 at a time, FR-11).
 *
 * @param results      the recipes
 * @param offset       where this batch started
 * @param nextOffset   pass this as offset to get the next 3 (FR-12)
 * @param totalResults how many Spoonacular found in total
 */
public record RecipePage(List<Recipe> results, int offset, int nextOffset, int totalResults) {
}
