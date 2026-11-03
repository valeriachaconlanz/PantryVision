package com.pantryvision.privacy;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Privacy note endpoints for the home page (FR-21).
 */
@RestController
@RequestMapping("/api/privacy")
@Validated
public class PrivacyController {

	private final PrivacyNoticeService noticeService;
	private final PrivacyAcceptanceService acceptanceService;

	public PrivacyController(PrivacyNoticeService noticeService, PrivacyAcceptanceService acceptanceService) {
		this.noticeService = noticeService;
		this.acceptanceService = acceptanceService;
	}

	/** The current privacy note to show on the home page. */
	@GetMapping
	public PrivacyNotice getNotice() {
		return noticeService.getNotice();
	}

	/** Whether this browser has accepted the current version of the note. */
	@GetMapping("/acceptance")
	public AcceptanceStatus getAcceptance(@RequestParam @NotBlank @Size(max = 64) String clientId) {
		return acceptanceService.getStatus(clientId);
	}

	/** Records that this browser accepted the note. */
	@PostMapping("/accept")
	@ResponseStatus(HttpStatus.CREATED)
	public AcceptanceStatus accept(@Valid @RequestBody AcceptPrivacyRequest request) {
		return acceptanceService.accept(request);
	}
}
