package com.anvyra.service.impl;

import com.anvyra.dto.UpdateUserRequest;
import com.anvyra.dto.UserResponse;
import com.anvyra.entity.User;
import com.anvyra.exception.ResourceNotFoundException;
import com.anvyra.mapper.EntityMapper;
import com.anvyra.repository.UserRepository;
import com.anvyra.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return mapper.toUserResponse(findOrThrow(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(mapper::toUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    public UserResponse update(Long id, UpdateUserRequest request) {
        User user = findOrThrow(id);
        if (request.firstName() != null) user.setFirstName(request.firstName());
        if (request.lastName() != null) user.setLastName(request.lastName());
        if (request.phoneNumber() != null) user.setPhoneNumber(request.phoneNumber());
        if (request.profileImage() != null) user.setProfileImage(request.profileImage());
        return mapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapper::toUserResponse)
                .toList();
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User", id);
        userRepository.deleteById(id);
    }

    private User findOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }
}
