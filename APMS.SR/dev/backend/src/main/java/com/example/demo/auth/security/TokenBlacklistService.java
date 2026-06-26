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
    public void blacklist(String token) {
        
        long remain =
        jwtProvider.parseClaims(token)
                   .getExpiration()
                   .getTime()
        - System.currentTimeMillis();
        
        if (remain <= 0) { return; // 이미 만료된 토큰은 blacklist 의미 없음
        }
        
        String jti = jwtProvider.getJti(token);
        
        redisTemplate.opsForValue().get("blacklist:" + jti);
    }

    // 체크
    public boolean isBlacklisted(String jti) {
        String jti = jwtProvider.getJti(token);

    return redisTemplate.opsForValue().get("blacklist:" + jti) != null;
    }
}
