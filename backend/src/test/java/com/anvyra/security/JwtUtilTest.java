package com.anvyra.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DisplayName("JwtUtil Unit Tests")
class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret",
                "TestSecretKeyForJWTSigningInTestsOnlyNotForProduction123456789");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpirationMs", 900000L);
    }

    @Test
    @DisplayName("generateToken: returns non-null token")
    void generateToken_returnsToken() {
        String token = jwtUtil.generateToken("user@example.com", List.of("CUSTOMER"));
        assertThat(token).isNotNull().isNotEmpty();
    }

    @Test
    @DisplayName("extractUsername: returns correct email")
    void extractUsername_correctEmail() {
        String token = jwtUtil.generateToken("user@example.com", List.of("CUSTOMER"));
        assertThat(jwtUtil.extractUsername(token)).isEqualTo("user@example.com");
    }

    @Test
    @DisplayName("validateToken: returns true for valid token")
    void validateToken_valid() {
        String token = jwtUtil.generateToken("user@example.com", List.of("CUSTOMER"));
        assertThat(jwtUtil.validateToken(token)).isTrue();
    }

    @Test
    @DisplayName("validateToken: returns false for tampered token")
    void validateToken_tampered() {
        String token = jwtUtil.generateToken("user@example.com", List.of("CUSTOMER"));
        String tampered = token + "tampered";
        assertThat(jwtUtil.validateToken(tampered)).isFalse();
    }

    @Test
    @DisplayName("validateToken: returns false for empty string")
    void validateToken_empty() {
        assertThat(jwtUtil.validateToken("")).isFalse();
    }
}
