package com.pantryvision.common;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Sends our own error messages to the frontend as {"status": 503, "message": "..."}.
 * Other errors fall back to Spring's default, which leaves the message out
 * so we don't leak things like database errors.
 */
@RestControllerAdvice
public class ApiErrorHandler {

	@ExceptionHandler(UserFacingException.class)
	public ResponseEntity<Map<String, Object>> handle(UserFacingException e) {
		int status = e.getStatusCode().value();
		return ResponseEntity.status(status).body(Map.of("status", status, "message", e.getReason()));
	}
}
