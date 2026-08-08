package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;

import com.example.demo.auth.security.UserAuthorityService;

import com.example.demo.iam.user.service.UserService;
import com.example.demo.iam.user.repository.UserRepository;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.domain.UserStatus;
import com.example.demo.auth.security.TokenBlacklistService;

import jakarta.servlet.FilterChain;                // 서브렛 http 요청 가로체기 및 jwt 검사
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;             // 생성자 주입 자동 생성

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;    // jwt 사용자 정보 추출 후 생성
import org.springframework.security.core.authority.SimpleGrantedAuthority;        // 권한 처리
import org.springframework.security.core.context.SecurityContextHolder;                    // 보안 문자열 보관
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;    // 요청 당 1회 실행 필터
import org.springframework.data.redis.core.RedisTemplate;    // redis 템플릿 으로 캐시 운용

import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;    // 기본 로거 호출용

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserAuthorityService userAuthorityService;
    
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath(); 
        
        //*---
        System.out.println("========== JWT FILTER ==========");
        System.out.println("PATH = " + path);
        System.out.println("METHOD = " + request.getMethod());
        //---*/
        
        // 1. auth 제외
        if (path.startsWith("/api/auth/")) {    System.out.println("AUTH PATH -> SKIP");
            filterChain.doFilter(request, response);
            return;
        }
        
        // 2. OPTIONS 패스
        if (request.getMethod().equals("OPTIONS")) {    System.out.println("OPTIONS -> SKIP");
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3. Authorization 헤더 체크
        String header = request.getHeader("Authorization");
            System.out.println("AUTH HEADER = " + header);
        if (header == null || !header.startsWith("Bearer ")) {    System.out.println("NO JWT -> CONTINUE");
            filterChain.doFilter(request, response);
            return;
        }
        String token = header.substring(7);     
        
        // 3.5 토큰 null 시 회원가입 의 경우
        if (token == null || token.isBlank()) {     System.out.println("EMPTY JWT -> CONTINUE");
            filterChain.doFilter(request, response);
            return;
        }
        
        try {       System.out.println("JWT VALIDATION START");
            // 4. JWT 검증 (먼저)
            if (!jwtProvider.validateToken(token)) {    System.out.println("JWT INVALID");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
                System.out.println("JWT VALID");
            // 5. claims 파싱
            Claims claims = jwtProvider.parseClaims(token);
                System.out.println("CLAIMS = " + claims);
            String jti = claims.getId();
            Long userId = Long.parseLong(claims.getSubject());
                System.out.println("USER ID = " + userId);
                System.out.println("JTI = " + jti);
            // 6. blacklist 체크
            if (jti != null && tokenBlacklistService.isBlacklisted(jti)) {    System.out.println("JWT BLACKLISTED");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
                
            // 7. 권한 조회
            List<GrantedAuthority> authorities = userAuthorityService.getAuthorities(userId);
                System.out.println("AUTHORITIES = " + authorities);
            
            // 8. SecurityContext 세팅
            CustomUserPrincipal principal = new CustomUserPrincipal(userId);
            
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            authorities
                    );
            
                
            SecurityContextHolder.getContext().setAuthentication(auth);
            //log.error("AUTH = " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
            System.out.println("AUTH = " + SecurityContextHolder.getContext().getAuthentication());
            System.out.println("AUTH = " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
             
            filterChain.doFilter(request, response);
        } catch (JwtException | IllegalArgumentException e) {                //너무 넓으니 나중에 세분화 예정
            // JWT 파싱/만료/변조 대비
            log.error("JWT authentication failed", e);
            //SecurityContextHolder.clearContext();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
