package com.pantryvision.auth;

import com.pantryvision.common.UserFacingException;
import com.pantryvision.user.User;
import com.pantryvision.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Sign up and log in logic (FR-2).
 *
 * <p>Passwords are stored as plain text for now so the team can build and test
 * without extra setup. TODO: hash passwords (e.g. with Spring Security's
 * BCryptPasswordEncoder) before this goes anywhere real.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Creates a new account, or 409 if the email is already taken. */
    public User signup(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new UserFacingException(
                HttpStatus.CONFLICT, "An account with that email already exists");
        }
        return userRepository.save(new User(email, password));
    }

    /** Checks credentials, or 401 if the email/password don't match. */
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserFacingException(
                HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.getPassword().equals(password)) {
            throw new UserFacingException(
                HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return user;
    }
}
