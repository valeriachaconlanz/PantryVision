package com.pantryvision.privacy;

import java.time.LocalDate;
import java.util.List;

/**
 * The privacy note. When the text changes, bump the version so users are asked to accept it again.
 */
public record PrivacyNotice(String version, LocalDate lastUpdated, String title, List<Section> sections) {

	public record Section(String heading, String body) {
	}
}
