package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.example.demo.iam.user.dto.TokenResponse;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.Claims;
import java.time.Duration; // 시간

@Service
@RequiredArgsConstructor
public class AuthService {    //    jti 접근 토큰 로직 관리 파일

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    
    private static final String ACCESS_KEY = "auth:access:";
    private static final String REFRESH_KEY = "auth:refresh:";
    
    private final PasswordEncoder passwordEncoder;    // 로그인 시 비번 검증 부분
    
    
    public TokenResponse refresh(String refreshToken) {

        if (!jwtProvider.validateToken(refreshToken)) {        //    jwt 리프레시 토큰 없으면 버림
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
            }

        // 0. parse once
        Claims claims = jwtProvider.parseClaims(refreshToken);

        // String type = claims.get("type", String.class);

        if (!"refresh".equals(claims.get("type"))) {                        //    리프레시 타입과 다르면 버림
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
            }

        // 1. 토큰에서 userId 추출
        Long userId = Long.parseLong(claims.getSubject());
        
        String saved = redisTemplate.opsForValue()
                .get(REFRESH_KEY + userId);
        
        if (saved == null || !saved.equals(refreshToken)) {                // 없으면 or 리프레시와 다르면
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }
        
        // 유저레포 에서 id 확인
        User user = userRepository.findById(userId)
                .orElseThrow();
        
        String newAccessToken =
                jwtProvider.createAccessToken(
                        user.getId(),
                        user.getUsername()
                );
        
        String newRefreshToken =
                jwtProvider.createRefreshToken(
                        user.getId()
                );
        
        // 접근 활성jti 설정
        String newJti = jwtProvider.getJti(newAccessToken);
        
        redisTemplate.opsForValue().set(
                ACCESS_KEY + userId,
                newJti,
                Duration.ofMinutes(30)
        );
        
        redisTemplate.opsForValue().set(
                REFRESH_KEY + userId,
                newRefreshToken,
                Duration.ofDays(7)
        );
        
        return new TokenResponse( newAccessToken, newRefreshToken );
    }
    
    
        // 로그인
    @Transactional
    public LoginResult login(LoginRequest req) {

        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String jti = jwtProvider.getJti(accessToken);

        redisTemplate.opsForValue().set(
                ACCESS_KEY + user.getId(),
                jti,
                Duration.ofMinutes(30)
        );

        String refreshToken = jwtProvider.createRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                REFRESH_KEY + user.getId(),
                refreshToken,
                Duration.ofDays(7)
        );

        return new LoginResult(accessToken, "Bearer", refreshToken);
    }
    
}
