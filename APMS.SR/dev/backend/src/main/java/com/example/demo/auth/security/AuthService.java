package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;
import com.example.demo.iam.user.repository.UserRepository;

import io.jsonwebtoken.Claims;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenBlacklistService blacklistService;

    private static final String ACCESS_KEY = "auth:access:";
    private static final String REFRESH_KEY = "auth:refresh:";

    @Transactional
    public LoginResult login(LoginRequest req) {

        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(user.getId());

        String jti = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                REFRESH_KEY + user.getId(),
                refreshToken,
                Duration.ofDays(7)
        );

        return new LoginResult(accessToken, "Bearer", refreshToken);
    }

    public TokenResponse refresh(String refreshToken) {

        if (!jwtProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        Claims claims = jwtProvider.parseClaims(refreshToken);

        if (!"refresh".equals(claims.get("type"))) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        Long userId = Long.parseLong(claims.getSubject());

        String saved = redisTemplate.opsForValue().get(REFRESH_KEY + userId);

        if (saved == null || !saved.equals(refreshToken)) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        User user = userRepository.findById(userId).orElseThrow();

        String newAccessToken = jwtProvider.createAccessToken(userId, user.getUsername());
        String newRefreshToken = jwtProvider.createRefreshToken(userId);
        String newJti = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                REFRESH_KEY + userId,
                newRefreshToken,
                Duration.ofDays(7)
        );

        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    public void logout(Long userId, String accessToken, String refreshToken) {


        redisTemplate.delete(REFRESH_KEY + userId);


        if (refreshToken != null) {
            blacklistService.blacklist(refreshToken);
        }
    }
}
