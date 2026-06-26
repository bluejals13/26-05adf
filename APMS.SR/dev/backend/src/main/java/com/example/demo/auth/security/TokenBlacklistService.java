package com.example.demo.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

//import com.example.demo.auth.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {    // 이미 발급된 토큰 차단    “탈취된 토큰 / 로그아웃 이후 요청 차단”

    private final RedisTemplate<String, String> redisTemplate;
    
    // blacklist 등록
    public void blacklist(String jti, long expirationMillis) {
        
        if (expirationMillis <= 0) { return; }
        
        redisTemplate.opsForValue().set(
                "blacklist:" + jti,
                "1",
                Duration.ofMillis(expirationMillis)
        );
        
        redisTemplate.opsForValue().set("blacklist:" + jti, "1", Duration.ofMillis(expirationMillis));
    }

    // 체크
    public boolean isBlacklisted(String jti) {

        return redisTemplate.hasKey("blacklist:" + jti);
    }
}
