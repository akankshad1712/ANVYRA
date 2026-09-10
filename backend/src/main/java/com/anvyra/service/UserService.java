package com.anvyra.service;

import com.anvyra.dto.UpdateUserRequest;
import com.anvyra.dto.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getById(Long id);
    UserResponse getByEmail(String email);
    UserResponse update(Long id, UpdateUserRequest request);
    List<UserResponse> getAllUsers();
    void delete(Long id);
}
