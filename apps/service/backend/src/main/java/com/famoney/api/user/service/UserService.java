package com.famoney.api.user.service;

import com.famoney.api.common.exception.BadRequestException;
import com.famoney.api.common.exception.ResourceNotFoundException;
import com.famoney.api.user.dto.ChangePasswordRequest;
import com.famoney.api.user.dto.UpdateUserRequest;
import com.famoney.api.user.dto.UserResponse;
import com.famoney.api.user.entity.User;
import com.famoney.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for user profile operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get user by ID.
     *
     * @param userId User ID
     * @return User response
     * @throws ResourceNotFoundException if user not found
     */
    public UserResponse getUser(String userId) {
        User user = findUserById(userId);
        log.debug("Retrieved user: {}", user.getEmail());
        return UserResponse.from(user);
    }

    /**
     * Update user profile.
     * Only non-null fields in the request will be updated.
     *
     * @param userId  User ID
     * @param request Update request with optional fields
     * @return Updated user response
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional
    public UserResponse updateUser(String userId, UpdateUserRequest request) {
        User user = findUserById(userId);

        // Partial update - only update non-null fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        User savedUser = userRepository.save(user);
        log.info("Updated user profile: {}", savedUser.getEmail());
        return UserResponse.from(savedUser);
    }

    /**
     * Delete user (soft delete).
     *
     * @param userId User ID
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional
    public void deleteUser(String userId) {
        User user = findUserById(userId);
        user.softDelete();
        userRepository.save(user);
        log.info("Soft deleted user: {}", user.getEmail());
    }

    /**
     * Change user password.
     *
     * @param userId  User ID
     * @param request Change password request with current and new password
     * @throws ResourceNotFoundException if user not found
     * @throws BadRequestException       if current password is incorrect
     */
    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = findUserById(userId);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("현재 비밀번호가 일치하지 않습니다.");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Changed password for user: {}", user.getEmail());
    }

    /**
     * Find active user by ID or throw exception.
     */
    private User findUserById(String userId) {
        return userRepository.findByIdAndDeletedAtIsNull(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
