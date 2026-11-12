package com.pantryvision.common;

import org.springframework.http.HttpStatusCode;
import org.springframework.web.server.ResponseStatusException;

/**
 * An error whose message is safe to show the user, like "we hit Spoonacular's daily limit".
 * Only these messages get sent to the browser (see {@link ApiErrorHandler}), anything else
 * just gets the status code.
 */
public class UserFacingException extends ResponseStatusException {

	public UserFacingException(HttpStatusCode status, String message) {
		super(status, message);
	}

	public UserFacingException(HttpStatusCode status, String message, Throwable cause) {
		super(status, message, cause);
	}
}
