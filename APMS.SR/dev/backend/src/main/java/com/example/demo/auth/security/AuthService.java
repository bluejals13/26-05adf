package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;
import com.example.demo.iam.user.repository.UserRepository;

import com.example.demo.common.exception.GlobalExceptionHandler;

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
    public LoginResult login(LoginRequest req) {    // 로그인

        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {    // 비번 매치 예외처리
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }
                
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String refreshToken = jwtProvider.createRefreshToken(user.getId());
        
        String currentJti = redisTemplate.opsForValue().get(REFRESH_KEY + user.getId());    // redis 에서 리프레시 , 유저 확인
        
        if (currentJti != null) {    // 중복 로그인 예외처리    && !forceLogin  강제 로그인 
            throw new DuplicateUserException("INVALID_AlreadyLogged");
        }
        
        String jti = jwtProvider.parseClaims(refreshToken).getId();
        
        redisTemplate.opsForValue().set(
                REFRESH_KEY + user.getId(),
                jti,
                Duration.ofDays(7)
        );

        return new LoginResult(accessToken, "Bearer", refreshToken);
    }

    public TokenResponse refresh(String refreshToken) {    // redis 로테 리프레시

        if (!jwtProvider.validateToken(refreshToken)) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        Claims claims = jwtProvider.parseClaims(refreshToken);

        if (!"refresh".equals(claims.get("type"))) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }
        
        Long userId = Long.parseLong(claims.getSubject());

        String redisJti  = redisTemplate.opsForValue().get(REFRESH_KEY + userId);

        if (redisJti == null || !redisJti.equals(claims.getId())) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        User user = userRepository.findById(userId).orElseThrow();

        String newAccessToken = jwtProvider.createAccessToken(userId, user.getUsername());
        String newRefreshToken = jwtProvider.createRefreshToken(userId);
        String newJti = jwtProvider.parseClaims(newRefreshToken).getId();
        
        redisTemplate.opsForValue().set(
                REFRESH_KEY + userId,
                newJti,
                Duration.ofDays(7)
        );
        
        return new TokenResponse(newAccessToken, newRefreshToken);
    }

    public void logout(String accessToken, String refreshToken) {    // 로그아웃
    
        Long userId = null;
    
        if (refreshToken != null) { userId = Long.parseLong(jwtProvider.parseClaims(refreshToken).getSubject()); }
    
        if (userId != null) {
            redisTemplate.delete(ACCESS_KEY + userId);
            redisTemplate.delete(REFRESH_KEY + userId);
        }
    
        if (accessToken != null) { blacklistService.blacklist(accessToken); }
    
        if (refreshToken != null) { blacklistService.blacklist(refreshToken); }
    }
}
