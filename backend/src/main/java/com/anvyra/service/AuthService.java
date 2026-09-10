package com.anvyra.service;

import com.anvyra.dto.AuthResponse;
import com.anvyra.dto.LoginRequest;
import com.anvyra.dto.RegisterRequest;
import com.anvyra.dto.TokenRefreshResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    TokenRefreshResponse refreshToken(String refreshToken);

    void logout(Long userId);
}