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

        // 2. Redis에서 저장된 refreshToken 조회
        String saved = redisTemplate.opsForValue()
                .get("refresh:" + userId);

        // 3. 검증 null 값 이나 혹은 없는 경우(로그아웃, 재로그인) refreshToken 과 비교 후 기존 토큰 차단
        if (saved == null || !saved.equals(refreshToken)) {
            throw new BadCredentialsException("INVALID_REFRESH_TOKEN");
        }

        // 4. 유저 조회
        User user = userRepository.findById(userId)
                .orElseThrow();    //    (() ->    new BadCredentialsException("USER_NOT_FOUND") );

        // 5. 새로운 접근 토큰 발급 username -> role 변경 예정 * 리프레시 토큰은 무관함
        String newAccessToken =
            jwtProvider.createAccessToken(user.getId(), user.getUsername());

        String newJti = jwtProvider.getJti(newAccessToken);
        redisTemplate.opsForValue().set(
            "active-jti:" + userId,
            newJti,
            Duration.ofMinutes(30)
            );

        return new TokenResponse(newAccessToken);
    }
}
