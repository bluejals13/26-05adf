package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;
import com.example.demo.auth.security.TokenBlacklistService;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;
import com.example.demo.iam.user.repository.UserRepository;

import com.example.demo.common.exception.DuplicateUserException;

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

    //private static final String ACCESS_KEY = "auth:access:";
    private static final String SESSION_KEY = "auth:session:";

    @Transactional
    public LoginResult login(LoginRequest req) {    // 로그인
        
        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {    // 비번 매치 예외처리
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }
        
        // 1. sessionId 생성 (refresh 역할)
        String sessionId = UUID.randomUUID().toString();
        
        //String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        //String refreshToken = jwtProvider.createRefreshToken(user.getId());
        
        //String currentJti = redisTemplate.opsForValue().get(REFRESH_KEY + user.getId());    // redis 에서 리프레시 , 유저 확인
        
        //String jti = jwtProvider.parseClaims(refreshToken).getId();
        
        // 2. Redis 저장 (단일 source of truth)
        redisTemplate.opsForValue().set(
                SESSION_KEY + user.getId(),
                sessionId,    // 랜덤 uuid 적용
                Duration.ofDays(7)
        );
        
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        
        return new LoginResult(accessToken, "Bearer", sessionId);
    }

    public TokenResponse refresh(String accessToken, String sessionId) {    // redis 로테 리프레시
        
        Claims claims = jwtProvider.parseClaims(accessToken);
        Long userId = Long.parseLong(claims.getSubject());
        
        String redisSession = redisTemplate.opsForValue().get(SESSION_KEY + userId);
        
        //if (blacklistService.isBlacklisted(refreshToken)) { throw new BadCredentialsException("블랙리스트 토큰"); }        
        
        if (redisSession == null || !redisSession.equals(sessionId)) {
            throw new BadCredentialsException("거부된 세션"); }
                
        
        
        //if (!"refresh".equals(claims.get("type"))) { throw new BadCredentialsException("INVALID_REFRESH_TOKEN"); }
        
        
        //Long userId = Long.parseLong(claims.getSubject());

        //String redisJti  = redisTemplate.opsForValue().get(REFRESH_KEY + userId);

        //if (redisJti == null || !redisJti.equals(claims.getId())) { throw new BadCredentialsException("INVALID_REFRESH_TOKEN"); }
        
        //User user = userRepository.findById(userId).orElseThrow();
        
        // rotation (atomic이 더 좋음)
        
        //String newRefreshToken = jwtProvider.createRefreshToken(userId);
        //String newJti = jwtProvider.parseClaims(newRefreshToken).getId();
        
        String userName = userRepository.findById(userId)
            .orElseThrow()
            .getUsername();
        
        String newAccessToken = jwtProvider.createAccessToken(userId, userName);
        
        return new TokenResponse(newAccessToken);
    }

    public void logout(String accessToken) {    // 로그아웃
        if (accessToken != null) {
            Claims claims = jwtProvider.parseClaims(accessToken);
            Long userId = Long.parseLong(claims.getSubject());
            String jti = claims.getId();
            long expirationMillis = claims.getExpiration().getTime() - System.currentTimeMillis();
            blacklistService.blacklist(jti, expirationMillis);
            redisTemplate.delete(SESSION_KEY + userId);
        }
        
        //if (refreshToken != null) {
            //Claims claims = jwtProvider.parseClaims(refreshToken);
            //Long userId = Long.parseLong(claims.getSubject());
        
            //redisTemplate.delete(REFRESH_KEY + userId);
        // Redis 세션 삭제 = 즉시 로그아웃
        
    }
}
