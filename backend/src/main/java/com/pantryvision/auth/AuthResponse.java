package com.pantryvision.auth;

/** JSON returned by the signup and login endpoints. */
public record AuthResponse(Long userId, String email, String message) {}
