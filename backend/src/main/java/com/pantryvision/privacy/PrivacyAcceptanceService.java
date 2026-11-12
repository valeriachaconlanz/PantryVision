package com.pantryvision.privacy;

import java.time.Clock;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PrivacyAcceptanceService {

	private final PrivacyAcceptanceRepository repository;
	private final PrivacyNoticeService noticeService;
	private final Clock clock = Clock.systemUTC();

	public PrivacyAcceptanceService(PrivacyAcceptanceRepository repository, PrivacyNoticeService noticeService) {
		this.repository = repository;
		this.noticeService = noticeService;
	}

	@Transactional(readOnly = true)
	public AcceptanceStatus getStatus(String clientId) {
		return repository.findFirstByClientIdOrderByAcceptedAtDescIdDesc(clientId)
				.map(this::toStatus)
				.orElseGet(AcceptanceStatus::notAccepted);
	}

	/**
	 * Saves that the user accepted the note. Returns 409 if they accepted an old version
	 * (for example, the note changed while the page was open) so the frontend can reload it.
	 */
	@Transactional
	public AcceptanceStatus accept(AcceptPrivacyRequest request) {
		String current = noticeService.currentVersion();
		if (!current.equals(request.version())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT,
					"Privacy note version " + request.version() + " is out of date. Current version is " + current + ".");
		}
		PrivacyAcceptance saved = repository.save(new PrivacyAcceptance(request.clientId(), current, Instant.now(clock)));
		return toStatus(saved);
	}

	private AcceptanceStatus toStatus(PrivacyAcceptance acceptance) {
		boolean upToDate = acceptance.getVersion().equals(noticeService.currentVersion());
		return new AcceptanceStatus(true, upToDate, acceptance.getVersion(), acceptance.getAcceptedAt());
	}
}
