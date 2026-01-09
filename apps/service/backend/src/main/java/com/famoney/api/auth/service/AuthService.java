package com.famoney.api.auth.service;

import com.famoney.api.auth.dto.AuthResponse;
import com.famoney.api.auth.dto.LoginRequest;
import com.famoney.api.auth.dto.RefreshTokenRequest;
import com.famoney.api.auth.dto.SignupRequest;
import com.famoney.api.auth.entity.RefreshToken;
import com.famoney.api.auth.repository.RefreshTokenRepository;
import com.famoney.api.common.exception.DuplicateResourceException;
import com.famoney.api.common.exception.InvalidTokenException;
import com.famoney.api.common.exception.UnauthorizedException;
import com.famoney.api.common.security.JwtTokenProvider;
import com.famoney.api.user.dto.UserResponse;
import com.famoney.api.user.entity.User;
import com.famoney.api.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Service for authentication operations.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Register a new user.
     *
     * @param request Signup request containing user details
     * @return Authentication response with tokens and user info
     * @throws DuplicateResourceException if email already exists
     */
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Create new user
        User user = User.builder()
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .build();

        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getId());

        // Generate tokens
        return createAuthResponse(user);
    }

    /**
     * Authenticate user with email and password.
     *
     * @param request Login request containing credentials
     * @return Authentication response with tokens and user info
     * @throws UnauthorizedException if credentials are invalid
     */
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());

        // Find user by email
        User user = userRepository.findByEmailIgnoreCaseAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        log.info("User logged in successfully: {}", user.getId());

        // Generate tokens
        return createAuthResponse(user);
    }

    /**
     * Refresh access token using refresh token.
     *
     * @param request Refresh token request
     * @return Authentication response with new tokens
     * @throws InvalidTokenException if refresh token is invalid
     */
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        log.debug("Attempting to refresh token");

        // Validate the JWT structure of the refresh token
        if (!jwtTokenProvider.validateToken(token) || !jwtTokenProvider.isRefreshToken(token)) {
            throw new InvalidTokenException("Invalid refresh token");
        }

        // Find and validate stored refresh token
        RefreshToken storedToken = refreshTokenRepository
                .findValidToken(token, LocalDateTime.now())
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found or expired"));

        // Get user from token
        User user = storedToken.getUser();

        // Revoke old refresh token
        storedToken.revoke();
        refreshTokenRepository.save(storedToken);

        log.info("Token refreshed successfully for user: {}", user.getId());

        // Generate new tokens
        return createAuthResponse(user);
    }

    /**
     * Logout user by revoking all refresh tokens.
     *
     * @param userId User ID to logout
     */
    @Transactional
    public void logout(String userId) {
        log.info("Logging out user: {}", userId);
        refreshTokenRepository.revokeAllByUserId(userId, LocalDateTime.now());
    }

    /**
     * Create authentication response with tokens.
     */
    private AuthResponse createAuthResponse(User user) {
        // Generate access token
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());

        // Generate and store refresh token
        String refreshTokenValue = jwtTokenProvider.generateRefreshToken(user.getId());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshTokenValue)
                .expiresAt(LocalDateTime.now().plusNanos(jwtTokenProvider.getRefreshTokenExpirationMs() * 1_000_000))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtTokenProvider.getAccessTokenExpirationInSeconds())
                .user(UserResponse.from(user))
                .build();
    }
}
