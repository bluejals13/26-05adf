package com.example.demo.auth.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final RedisTemplate<String, String> redisTemplate;

    public void blacklist(String jti, long expirationMillis) {

        try {
            redisTemplate.opsForValue().set(
                    "blacklist:" + jti,
                    "1",
                    java.time.Duration.ofMillis(expirationMillis)
            );
        } catch (RedisConnectionFailureException e) {
            throw new RedisUnavailableException(e);
        }
    }

    public boolean isBlacklisted(String jti) {

        try {
            return Boolean.TRUE.equals(
                    redisTemplate.hasKey("blacklist:" + jti)
            );
        } catch (RedisConnectionFailureException e) {
            throw new RedisUnavailableException(e);
        }
    }
}
