package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final TokenBlacklistService tokenBlacklistService;
    private final UserAuthorityService userAuthorityService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getServletPath();

        // 1. 인증 관련 API는 JWT 필터 제외
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. CORS preflight 요청 제외
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Authorization 헤더 확인
        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        if (token.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // 4. JWT 검증
            if (!jwtProvider.validateToken(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // 5. JWT Claims 추출
            Claims claims = jwtProvider.parseClaims(token);

            String jti = claims.getId();
            Long userId = Long.parseLong(claims.getSubject());

            // 6. Access Token blacklist 확인
            if (jti != null && tokenBlacklistService.isBlacklisted(jti)) {
                log.debug("Blacklisted JWT detected. jti={}", jti);

                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // 7. 사용자 권한 조회
            List<GrantedAuthority> authorities =
                    userAuthorityService.getAuthorities(userId);

            // 8. SecurityContext 인증 정보 생성
            CustomUserPrincipal principal =
                    new CustomUserPrincipal(userId);

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            authorities
                    );

            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            // 9. 다음 필터로 진행
            filterChain.doFilter(request, response);

        } catch (RedisUnavailableException e) {     // Redis 장애 → 503

            /*
             * Redis 장애 시 blacklist 상태를 확인할 수 없으므로
             * 보안상 인증을 진행하지 않는다.
             */
            log.error(
                    "Redis is unavailable. Authentication cannot be verified.",
                    e
            );

            SecurityContextHolder.clearContext();

            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            return;

        } catch (JwtException | IllegalArgumentException e) {     // JWT 인증 실패 → 401

            // JWT 변조 / 만료 / 잘못된 형식 / subject 파싱 실패 등
            log.warn("Invalid JWT", e);

            SecurityContextHolder.clearContext();

            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
            return;
        }
    }
}
