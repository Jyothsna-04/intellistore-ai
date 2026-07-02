package com.intellistore.service;

import com.intellistore.dto.*;
import com.intellistore.entity.*;
import com.intellistore.exception.AccountLockedException;
import com.intellistore.exception.ResourceNotFoundException;
import com.intellistore.exception.UserAlreadyExistsException;
import com.intellistore.repository.RoleRepository;
import com.intellistore.repository.UserRepository;
import com.intellistore.security.JwtUtils;
import com.intellistore.security.UserDetailsImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils, RefreshTokenService refreshTokenService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
    }

    @Transactional
    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        // Find user to check if locked
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(OffsetDateTime.now())) {
            throw new AccountLockedException("Account is locked until " + user.getAccountLockedUntil());
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Reset failed login attempts on successful login
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            user.setLastLoginAt(OffsetDateTime.now());
            userRepository.save(user);

            String jwt = jwtUtils.generateJwtToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

            return AuthResponse.builder()
                    .accessToken(jwt)
                    .refreshToken(refreshToken.getToken())
                    .user(mapToUserDto(user))
                    .build();
        } catch (Exception e) {
            // Increment failed login attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setAccountLockedUntil(OffsetDateTime.now().plusMinutes(15));
                log.warn("Account locked for email {} due to too many failed attempts", user.getEmail());
            }
            userRepository.save(user);
            throw e;
        }
    }

    @Transactional
    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new UserAlreadyExistsException("Error: Email is already in use!");
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName(RoleName.ROLE_EMPLOYEE)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        // Auto login after registration (or require email verification depending on requirements)
        // Here we just auto-login and return token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        return AuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Transactional
    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        RefreshToken refreshToken = refreshTokenService.verifyExpiration(refreshTokenService.findByToken(requestRefreshToken));
        User user = refreshToken.getUser();
        String token = jwtUtils.generateTokenFromEmail(user.getEmail());
        return TokenRefreshResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken.getToken())
                .build();
    }

    private UserDto mapToUserDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .department(user.getDepartment())
                .jobTitle(user.getJobTitle())
                .roles(roles)
                .storageQuotaBytes(user.getStorageQuotaBytes())
                .storageUsedBytes(user.getStorageUsedBytes())
                .build();
    }
}
