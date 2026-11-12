package com.pantryvision.privacy;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Body of POST /api/privacy/accept.
 *
 * @param clientId the random id the browser saved in localStorage
 * @param version  the version of the note the user saw (must be the current one)
 */
public record AcceptPrivacyRequest(
		@NotBlank @Size(max = 64) String clientId,
		@NotBlank @Size(max = 32) String version) {
}
