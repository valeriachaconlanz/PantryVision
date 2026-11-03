package com.pantryvision.privacy;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import tools.jackson.databind.json.JsonMapper;

/**
 * Loads the privacy note from privacy-notice.json once when the app starts.
 * If the file is missing or broken the app won't start, so we find out right away.
 */
@Service
public class PrivacyNoticeService {

	static final String NOTICE_FILE = "privacy-notice.json";

	private final PrivacyNotice notice;

	public PrivacyNoticeService(JsonMapper jsonMapper) {
		try (InputStream in = new ClassPathResource(NOTICE_FILE).getInputStream()) {
			this.notice = jsonMapper.readValue(in, PrivacyNotice.class);
		}
		catch (IOException e) {
			throw new UncheckedIOException("Could not read " + NOTICE_FILE, e);
		}
		if (notice.version() == null || notice.version().isBlank()) {
			throw new IllegalStateException(NOTICE_FILE + " needs a version");
		}
	}

	public PrivacyNotice getNotice() {
		return notice;
	}

	public String currentVersion() {
		return notice.version();
	}
}
