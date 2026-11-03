package com.pantryvision.privacy;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivacyAcceptanceRepository extends JpaRepository<PrivacyAcceptance, Long> {

	/** The most recent acceptance for this browser, if there is one. */
	Optional<PrivacyAcceptance> findFirstByClientIdOrderByAcceptedAtDescIdDesc(String clientId);
}
