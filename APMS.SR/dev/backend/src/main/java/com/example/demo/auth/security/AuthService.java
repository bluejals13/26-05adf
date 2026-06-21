package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.example.demo.iam.user.dto.TokenResponse;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.repository.UserRepository;

import io.jsonwebtoken.Claims;
import java.time.Duration; // 시간

@Service
@RequiredArgsConstructor
public class AuthService {    //    jti 접근 토큰 로직 관리 파일

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;

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
                .get("auth:refresh:" + userId);
        
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
                "auth:access:" + userId,
                newJti,
                Duration.ofMinutes(30)
        );
        
        redisTemplate.opsForValue().set(
                "auth:refresh:" + userId,
                newRefreshToken,
                Duration.ofDays(7)
        );
        
        return new TokenResponse( newAccessToken, newRefreshToken );
    }
}
