package com.anvyra.service.impl;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.anvyra.dto.AuthResponse;
import com.anvyra.dto.LoginRequest;
import com.anvyra.dto.RegisterRequest;
import com.anvyra.dto.TokenRefreshResponse;
import com.anvyra.entity.RefreshToken;
import com.anvyra.entity.User;
import com.anvyra.exception.BadRequestException;
import com.anvyra.exception.DuplicateResourceException;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.repository.RefreshTokenRepository;
import com.anvyra.repository.UserRepository;
import com.anvyra.security.JwtUtil;
import com.anvyra.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Value("${app.jwt.refresh-expiration-seconds:2592000}")
    private long refreshExpirationSeconds;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);
        String accessToken = jwtUtil.generateToken(savedUser.getEmail(), List.of(savedUser.getRole().name()));
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return new AuthResponse(accessToken, refreshToken.getToken(), "Bearer");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Delete existing refresh tokens to prevent accumulation
        refreshTokenRepository.deleteByUserId(user.getId());

        String accessToken = jwtUtil.generateToken(user.getEmail(), List.of(user.getRole().name()));
        RefreshToken refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken(), "Bearer");
    }

    @Override
    public TokenRefreshResponse refreshToken(String refreshTokenValue) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new BadRequestException("Refresh token not found or invalid"));

        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new BadRequestException("Refresh token has expired. Please log in again.");
        }

        if (token.isRevoked()) {
            throw new BadRequestException("Refresh token has been revoked. Please log in again.");
        }

        String accessToken = jwtUtil.generateToken(
                token.getUser().getEmail(),
                List.of(token.getUser().getRole().name())
        );
        return new TokenRefreshResponse(accessToken, "Bearer");
    }

    @Override
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    private RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .user(user)
                .expiryDate(Instant.now().plusSeconds(refreshExpirationSeconds))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }
}
