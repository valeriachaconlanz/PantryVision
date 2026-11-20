package com.pantryvision.auth;

/** JSON body for POST /api/auth/login. */
public record LoginRequest(String email, String password) {}
