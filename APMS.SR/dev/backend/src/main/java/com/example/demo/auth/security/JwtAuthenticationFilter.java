package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;

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
import io.jsonwebtoken.Claims;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklistService;
    
    
    
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath(); 
        
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String header = request.getHeader("Authorization");
        
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String token = header.substring(7);     
        
        // 0. JWT 검증
        if (!jwtProvider.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
                
        // 1. 블랙리스트 체크 (최우선)
        if (tokenBlacklistService.isBlacklisted(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Claims claims = jwtProvider.parseClaims(token);
        String jti = claims.getId();
        Long userId = Long.parseLong(claims.getSubject());

        System.out.println("userId=" + userId);
        System.out.println("jti=" + jti);

        
        // 2. Redis session check (SAFE MODE)
        // String activeJti = redisTemplate.opsForValue().get("active-jti:" + userId);

        // System.out.println("activeJti=" + activeJti);

        // if (activeJti != null && !activeJti.equals(jti)) { response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); return; }

        // 3. User load
        User user = userRepository.findWithRolesById(userId)
                .orElseThrow();

        // 4. user status check
        if (user.getStatus() != UserStatus.ACTIVE) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // 5. authorities build
        List<GrantedAuthority> authorities = new ArrayList<>();
        
        // ROLE
        user.getRoles().forEach(r ->
                authorities.add(new SimpleGrantedAuthority("ROLE_" + r.getName()))
        );

        // PERMISSION

        user.getRoles().forEach(r ->
            r.getPermissions().forEach(p ->
                authorities.add(new SimpleGrantedAuthority(p.getName()))
                )
            );
        
        
        
        // 6. Security context
        CustomUserPrincipal principal = new CustomUserPrincipal(userId);

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        authorities
                );
        
        SecurityContextHolder.getContext().setAuthentication(auth);
        System.out.println("AUTH = " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        
        filterChain.doFilter(request, response);
    }
}
