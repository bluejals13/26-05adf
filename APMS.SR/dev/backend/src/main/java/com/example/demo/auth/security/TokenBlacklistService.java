package com.example.demo.auth.security;

import java.time.Duration;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.RedisSystemException;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

```
private static final String BLACKLIST_KEY_PREFIX = "blacklist:";

private final RedisTemplate<String, String> redisTemplate;

/**
 * Access Token의 JTI를 blacklist에 등록한다.
 *
 * @param jti JWT ID
 * @param expirationMillis blacklist 유지 시간(ms)
 */
public void blacklist(String jti, long expirationMillis) {

    try {
        redisTemplate.opsForValue().set(
                buildKey(jti),
                "1",
                Duration.ofMillis(expirationMillis)
        );

    } catch (RedisSystemException e) {
        throw new RedisUnavailableException("Redis is unavailable", e);
    }
}

/**
 * 해당 JTI가 blacklist에 등록되어 있는지 확인한다.
 *
 * @param jti JWT ID
 * @return blacklist 등록 여부
 */
public boolean isBlacklisted(String jti) {

    try {
        return Boolean.TRUE.equals(
                redisTemplate.hasKey(buildKey(jti))
        );

    } catch (RedisSystemException e) {
        throw new RedisUnavailableException("Redis is unavailable", e);
    }
}

    private String buildKey(String jti) {
        return BLACKLIST_KEY_PREFIX + jti;
    }

}
