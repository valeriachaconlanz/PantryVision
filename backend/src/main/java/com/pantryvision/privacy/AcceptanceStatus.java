package com.pantryvision.privacy;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * What the frontend needs to decide whether to show the privacy note.
 *
 * @param accepted        the user has accepted some version of the note
 * @param upToDate        the user has accepted the current version (if false, show the note)
 * @param acceptedVersion the version they last accepted, or left out if none
 * @param acceptedAt      when they last accepted, or left out if never
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AcceptanceStatus(boolean accepted, boolean upToDate, String acceptedVersion, Instant acceptedAt) {

	static AcceptanceStatus notAccepted() {
		return new AcceptanceStatus(false, false, null, null);
	}
}
