package com.anvyra.controller;

import com.anvyra.dto.AuthResponse;
import com.anvyra.dto.LoginRequest;
import com.anvyra.dto.RegisterRequest;
import com.anvyra.exception.GlobalExceptionHandler;
import com.anvyra.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Standalone MockMvc tests — no Spring context, no security filter.
 * Tests focus on controller logic and request/response mapping.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController Unit Tests")
class AuthControllerTest {

    @Mock AuthService authService;
    @InjectMocks AuthController authController;

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final AuthResponse validAuthResponse =
            new AuthResponse("access_token_value", "refresh_token_value", "Bearer");

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("POST /api/auth/register - 201 with valid request")
    void register_validRequest_returns201() throws Exception {
        when(authService.register(any(RegisterRequest.class))).thenReturn(validAuthResponse);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validRegisterRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").value("access_token_value"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when email is blank")
    void register_blankEmail_returns400() throws Exception {
        RegisterRequest req = validRegisterRequest();
        req.setEmail("");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/register - 400 when password too short")
    void register_shortPassword_returns400() throws Exception {
        RegisterRequest req = validRegisterRequest();
        req.setPassword("short");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /api/auth/login - 200 with valid credentials")
    void login_validCredentials_returns200() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("john@example.com");
        req.setPassword("password123");

        when(authService.login(any(LoginRequest.class))).thenReturn(validAuthResponse);

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("access_token_value"));
    }

    @Test
    @DisplayName("POST /api/auth/login - 400 when email missing")
    void login_missingEmail_returns400() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("");
        req.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    private RegisterRequest validRegisterRequest() {
        RegisterRequest req = new RegisterRequest();
        req.setFirstName("John");
        req.setLastName("Doe");
        req.setEmail("john@example.com");
        req.setPassword("password123");
        return req;
    }
}
