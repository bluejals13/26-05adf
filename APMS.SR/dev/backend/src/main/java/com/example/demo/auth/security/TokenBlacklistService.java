package com.example.demo.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

import com.example.demo.auth.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {    // 이미 발급된 토큰 차단    “탈취된 토큰 / 로그아웃 이후 요청 차단”

    private final RedisTemplate<String, String> redisTemplate;
    private final JwtProvider jwtProvider;

    // blacklist 등록
    public void blacklist(String token, long ttl) {
        
        long remain =
        jwtProvider.parseClaims(token)
                   .getExpiration()
                   .getTime()
        - System.currentTimeMillis();

        
        String jti = jwtProvider.getJti(token);
        redisTemplate.opsForValue().set(
                "blacklist:" + jti,
                "true",
                Duration.ofMillis(remain)
        );
    }

    // 체크
    public boolean isBlacklisted(String token) {
        String jti = jwtProvider.getJti(token);

    return Boolean.TRUE.equals( redisTemplate.hasKey("blacklist:" + jti) );
    }
}
