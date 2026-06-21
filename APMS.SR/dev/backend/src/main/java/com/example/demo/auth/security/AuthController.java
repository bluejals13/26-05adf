package com.example.demo.auth.security;

import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;

import com.example.demo.auth.security.AuthService;
import com.example.demo.auth.security.CustomUserPrincipal;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResult> login(
            @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {

        LoginResult result = authService.login(req);

        Cookie cookie = new Cookie("refreshToken", result.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);

        response.addCookie(cookie);

        return ResponseEntity.ok(
                new LoginResult(result.accessToken(), "Bearer", null)
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        String refreshToken = extractRefreshToken(request);

        TokenResponse token = authService.refresh(refreshToken);

        Cookie cookie = new Cookie("refreshToken", token.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);

        response.addCookie(cookie);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
public ResponseEntity<Void> logout(
        @AuthenticationPrincipal CustomUserPrincipal principal,
        HttpServletRequest request,
        HttpServletResponse response
) {

    String accessToken = extractAccessToken(request);
    String refreshToken = extractRefreshToken(request);  
    
    
    authService.logout(
            principal.getUserId(),
            accessToken,
            refreshToken
    );

    // refresh token cookie 삭제
    Cookie cookie = new Cookie("refreshToken", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(0);
    response.addCookie(cookie);

    return ResponseEntity.noContent().build();
}

    private String extractRefreshToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie c : request.getCookies()) {
            if ("refreshToken".equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    private String extractAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        return (header != null && header.startsWith("Bearer "))
                ? header.substring(7)
                : null;
    }
}
