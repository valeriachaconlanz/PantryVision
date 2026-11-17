package com.pantryvision.auth;

/** JSON body for POST /api/auth/signup. */
public record SignupRequest(String email, String password) {}
