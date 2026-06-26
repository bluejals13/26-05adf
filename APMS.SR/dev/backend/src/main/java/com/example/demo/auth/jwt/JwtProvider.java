package com.example.demo.auth.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;    // jwt 서명 용 보안 키 와 jjwt : HS256 방식 대칭키
import jakarta.annotation.PostConstruct; // 빈 생성 후 초기화 : 보안 키 검증용
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;     // 보안 키 객체
import java.util.Date;        // 만료 날짜
import java.util.UUID;        // 만료 jti
import lombok.extern.slf4j.Slf4j;    // 기본 로거 호출용

@Slf4j
@Component
public class JwtProvider {    // 각 토큰 제공 파일
    
    // application.yaml 부분의 환경 변수 일치 확인 할 것
    
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.access-expiration}")
    private long accessExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;
    
    //
    
    private Key key;
    // secretKey 길이 32바이트 미만이면 런타임 에러
    @PostConstruct
    public void init() {            //Secret Key 검증 부분
        if (secretKey == null || secretKey.length() < 32) {
            throw new IllegalStateException(
                "JWT Secret Key must be at least 32 characters."
                );
            }  

        this.key = Keys.hmacShaKeyFor(
            secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    // 1. 접근 토큰 생성
    public String createAccessToken(Long userId, String username) {    // String ( username > role ) 으로 나중 role 추가 시
    Date now = new Date();
    Date expiry = new Date(now.getTime() + accessExpiration);

    String jti = UUID.randomUUID().toString();

    return Jwts.builder()
            .setSubject(String.valueOf(userId))
            .setId(jti) // 🔥 핵심
            .claim("username", username) 
            .claim("type", "access") // 나중에 필터 에서 string = claims.get("type" ~~~~) \n if (!"access".equals(type))
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(key, SignatureAlgorithm.HS256)        // HS256(대칭키) 디지털 서명 핵심 보안층
            .compact();
}
    // 1. 리프레시 토큰 생성    
    public String createRefreshToken(Long userId) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + refreshExpiration);

    String jti = UUID.randomUUID().toString();

    return Jwts.builder()
            .setSubject(String.valueOf(userId))
            .setId(jti) // 🔥 핵심
            .claim("type", "refresh")
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(key, SignatureAlgorithm.HS256)        // HS256(대칭키) 디지털 서명 핵심 보안층
            .compact();
}
    

    // 2. claims 공통 파서
    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    // 2-5. Jti 추출
    public String getJti(String token) {
        return parseClaims(token).getId();
    }

    // 3. userId 추출
    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    // 4. 중복 등 예외처리 시 검증
    public boolean validateToken(String token) { //expired / malformed / signature error 구분 추가
        if (token == null || token.isBlank()) { return false; }    // null 값 회원가입 시
        try {
            parseClaims(token);
            return true;
        } catch (JwtException e) {
            log.error("JWT FAIL TYPE = {}", e.getClass().getSimpleName());
            log.error("JWT FAIL MSG = {}", e.getMessage());
            // 필요 시 로그
            
            return false;
        }
    }
    
    // 5. role 추출 username -> role 변경 예정
    // JwtAuthenticationFilter 에서 Authority 생성 시 사용
    public String getRole(String token) {
        return parseClaims(token)
            .get("role", String.class);
    }

}
