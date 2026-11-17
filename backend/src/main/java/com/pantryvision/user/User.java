package com.pantryvision.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * A user account (FR-2). For now this just holds login credentials; diet
 * preferences and allergies (FR-1, FR-3) can be added here or in a related
 * entity later.
 */
@Entity
@Table(name = "users") // "user" is a reserved word in H2/Postgres, so use "users"
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // plain text for now — TODO: hash later (FR-2)

    protected User() {} // JPA requires a no-arg constructor

    public User(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
