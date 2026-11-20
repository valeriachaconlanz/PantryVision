package com.pantryvision.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Database access for {@link User}. Spring Data JPA generates the SQL from the
 * method names, so there is no query code to write here.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
