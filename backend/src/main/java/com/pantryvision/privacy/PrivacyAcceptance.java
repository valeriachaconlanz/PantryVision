package com.pantryvision.privacy;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

/**
 * One time a user accepted the privacy note. We add a new row every time instead of
 * updating the old one, so we keep a history of which versions they accepted.
 *
 * clientId is a random id the browser makes and keeps in localStorage, because there's
 * no login yet. Once login (FR-2) is done we can add a userId column.
 */
@Entity
@Table(name = "privacy_acceptance", indexes = @Index(name = "idx_privacy_acceptance_client", columnList = "clientId"))
public class PrivacyAcceptance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 64)
	private String clientId;

	@Column(nullable = false, length = 32)
	private String version;

	@Column(nullable = false)
	private Instant acceptedAt;

	protected PrivacyAcceptance() {
		// for JPA
	}

	public PrivacyAcceptance(String clientId, String version, Instant acceptedAt) {
		this.clientId = clientId;
		this.version = version;
		this.acceptedAt = acceptedAt;
	}

	public Long getId() {
		return id;
	}

	public String getClientId() {
		return clientId;
	}

	public String getVersion() {
		return version;
	}

	public Instant getAcceptedAt() {
		return acceptedAt;
	}
}
