package com.pantryvision.privacy;

import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PrivacyControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private PrivacyNoticeService noticeService;

	@Autowired
	private PrivacyAcceptanceRepository acceptanceRepository;

	private static String newClientId() {
		return UUID.randomUUID().toString();
	}

	private static String acceptBody(String clientId, String version) {
		return """
				{"clientId": "%s", "version": "%s"}
				""".formatted(clientId, version);
	}

	@Test
	void getNoticeReturnsCurrentVersionAndSections() throws Exception {
		mockMvc.perform(get("/api/privacy"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.version").value(noticeService.getNotice().version()))
				.andExpect(jsonPath("$.lastUpdated").isNotEmpty())
				.andExpect(jsonPath("$.title").isNotEmpty())
				.andExpect(jsonPath("$.sections", hasSize(greaterThan(0))))
				.andExpect(jsonPath("$.sections[*].heading", everyItem(not(emptyString()))))
				.andExpect(jsonPath("$.sections[*].body", everyItem(not(emptyString()))));
	}

	@Test
	void unknownClientHasNotAccepted() throws Exception {
		mockMvc.perform(get("/api/privacy/acceptance").param("clientId", newClientId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accepted").value(false))
				.andExpect(jsonPath("$.upToDate").value(false))
				.andExpect(jsonPath("$.acceptedVersion").doesNotExist())
				.andExpect(jsonPath("$.acceptedAt").doesNotExist());
	}

	@Test
	void acceptingCurrentVersionIsRecorded() throws Exception {
		String clientId = newClientId();
		String version = noticeService.getNotice().version();

		mockMvc.perform(post("/api/privacy/accept")
						.contentType(MediaType.APPLICATION_JSON)
						.content(acceptBody(clientId, version)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.accepted").value(true))
				.andExpect(jsonPath("$.upToDate").value(true))
				.andExpect(jsonPath("$.acceptedVersion").value(version))
				.andExpect(jsonPath("$.acceptedAt").isNotEmpty());

		mockMvc.perform(get("/api/privacy/acceptance").param("clientId", clientId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accepted").value(true))
				.andExpect(jsonPath("$.upToDate").value(true))
				.andExpect(jsonPath("$.acceptedVersion").value(version));
	}

	@Test
	void acceptanceOfOlderVersionIsNotUpToDate() throws Exception {
		String clientId = newClientId();
		acceptanceRepository.save(new PrivacyAcceptance(clientId, "0.0-old", Instant.now()));

		mockMvc.perform(get("/api/privacy/acceptance").param("clientId", clientId))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.accepted").value(true))
				.andExpect(jsonPath("$.upToDate").value(false))
				.andExpect(jsonPath("$.acceptedVersion").value("0.0-old"));
	}

	@Test
	void acceptingOutdatedVersionIsConflict() throws Exception {
		mockMvc.perform(post("/api/privacy/accept")
						.contentType(MediaType.APPLICATION_JSON)
						.content(acceptBody(newClientId(), "0.0-old")))
				.andExpect(status().isConflict());
	}

	@Test
	void acceptingWithBlankClientIdIsBadRequest() throws Exception {
		mockMvc.perform(post("/api/privacy/accept")
						.contentType(MediaType.APPLICATION_JSON)
						.content(acceptBody("", noticeService.getNotice().version())))
				.andExpect(status().isBadRequest());
	}

	@Test
	void acceptingWithMissingVersionIsBadRequest() throws Exception {
		mockMvc.perform(post("/api/privacy/accept")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"clientId\": \"" + newClientId() + "\"}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void acceptanceStatusWithoutClientIdIsBadRequest() throws Exception {
		mockMvc.perform(get("/api/privacy/acceptance"))
				.andExpect(status().isBadRequest());
	}
}
