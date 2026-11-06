package com.agrishare.service;

import com.agrishare.dto.AuthDto;
import com.agrishare.model.Role;
import com.agrishare.model.User;
import com.agrishare.repository.UserRepository;
import com.agrishare.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = tokenProvider.generateTokenForEmailAndRole(user.getEmail(), user.getRole().name());

        return new AuthDto.AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getAddress(),
                user.getLatitude(),
                user.getLongitude(),
                user.getAvatarUrl()
        );
    }

    public AuthDto.AuthResponse register(AuthDto.RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with this email already exists");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_FARMER;

        User user = new User(
                request.getName(),
                email,
                passwordEncoder.encode(request.getPassword()),
                role,
                request.getPhone(),
                request.getAddress() != null ? request.getAddress() : "Nizamabad, Telangana",
                request.getLatitude() != null ? request.getLatitude() : 18.6725,
                request.getLongitude() != null ? request.getLongitude() : 78.0941,
                "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150"
        );

        user = userRepository.save(user);

        String token = tokenProvider.generateTokenForEmailAndRole(user.getEmail(), user.getRole().name());

        return new AuthDto.AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPhone(),
                user.getAddress(),
                user.getLatitude(),
                user.getLongitude(),
                user.getAvatarUrl()
        );
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
