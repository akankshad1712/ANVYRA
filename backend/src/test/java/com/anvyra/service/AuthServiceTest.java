package com.anvyra.service;

import com.anvyra.dto.AuthResponse;
import com.anvyra.dto.LoginRequest;
import com.anvyra.dto.RegisterRequest;
import com.anvyra.entity.RefreshToken;
import com.anvyra.entity.User;
import com.anvyra.entity.UserRole;
import com.anvyra.exception.BadRequestException;
import com.anvyra.exception.DuplicateResourceException;
import com.anvyra.repository.RefreshTokenRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.security.JwtUtil;
import com.anvyra.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock UserRepository userRepository;
    @Mock RefreshTokenRepository refreshTokenRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock AuthenticationManager authenticationManager;
    @Mock JwtUtil jwtUtil;

    @InjectMocks
    AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User savedUser;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshExpirationSeconds", 2592000L);

        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail("john@example.com");
        registerRequest.setPassword("password123");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("john@example.com");
        loginRequest.setPassword("password123");

        savedUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .password("encoded_password")
                .role(UserRole.CUSTOMER)
                .enabled(true)
                .build();
    }

    @Test
    @DisplayName("register: success with new email")
    void register_success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded_password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtUtil.generateToken(anyString(), anyList())).thenReturn("access_token");
        RefreshToken rt = RefreshToken.builder()
                .token("refresh_token")
                .user(savedUser)
                .expiryDate(Instant.now().plusSeconds(2592000))
                .revoked(false)
                .build();
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(rt);

        AuthResponse response = authService.register(registerRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh_token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("register: throws DuplicateResourceException when email exists")
    void register_duplicateEmail_throws() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    @DisplayName("login: success with valid credentials")
    void login_success() {
        when(authenticationManager.authenticate(any())).thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(savedUser));
        when(jwtUtil.generateToken(anyString(), anyList())).thenReturn("access_token");
        RefreshToken rt = RefreshToken.builder()
                .token("refresh_token")
                .user(savedUser)
                .expiryDate(Instant.now().plusSeconds(2592000))
                .revoked(false)
                .build();
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(rt);

        AuthResponse response = authService.login(loginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getAccessToken()).isEqualTo("access_token");
    }

    @Test
    @DisplayName("login: throws when credentials are invalid")
    void login_badCredentials_throws() {
        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    @DisplayName("logout: deletes refresh tokens for user")
    void logout_deletesTokens() {
        authService.logout(1L);
        verify(refreshTokenRepository).deleteByUserId(1L);
    }

    @Test
    @DisplayName("refreshToken: throws when token not found")
    void refreshToken_notFound_throws() {
        when(refreshTokenRepository.findByToken(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refreshToken("invalid_token"))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    @DisplayName("refreshToken: throws when token is expired")
    void refreshToken_expired_throws() {
        RefreshToken expired = RefreshToken.builder()
                .token("expired_token")
                .user(savedUser)
                .expiryDate(Instant.now().minusSeconds(3600)) // past
                .revoked(false)
                .build();
        when(refreshTokenRepository.findByToken("expired_token")).thenReturn(Optional.of(expired));

        assertThatThrownBy(() -> authService.refreshToken("expired_token"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("expired");
    }
}
