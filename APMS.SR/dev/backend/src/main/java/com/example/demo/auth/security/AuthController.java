package com.example.demo.auth.security;

import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;

import com.example.demo.auth.security.AuthService;
import com.example.demo.auth.security.CustomUserPrincipal;

import com.example.demo.auth.jwt.JwtProvider;

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
    private final JwtProvider jwtProvider;
    
    
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
        
        
        System.out.println("LOGIN ==================== ");        
        
        response.addCookie(cookie);
        System.out.println("accessToken = " + result.accessToken());
        System.out.println("refreshToken = " + result.refreshToken());
        
        return ResponseEntity.ok(
                new LoginResult(result.accessToken(), "Bearer", result.refreshToken())
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        String accessToken = extractAccessToken(request);
        String refreshToken = extractRefreshToken(request);
        
        TokenResponse token = authService.refresh(refreshToken);

        Cookie cookie = new Cookie("refreshToken", token.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);
        
        System.out.println("REFRESH ==================== ");        
        
        response.addCookie(cookie);
        System.out.println("accessToken = " + token.accessToken());
        System.out.println("refreshToken = " + refreshToken);

        return ResponseEntity.ok(token);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
) {

    String accessToken = extractAccessToken(request);
    String refreshToken = extractRefreshToken(request);  
    
    authService.logout(accessToken);
        
    // refresh token cookie 삭제
    Cookie cookie = new Cookie("refreshToken", refreshToken);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(0);
        
    //if (refreshToken != null) { try { userId = Long.parseLong(jwtProvider.parseClaims(refreshToken).getSubject());
        //} catch (Exception ignored) {}
    //}
        
    System.out.println("LOGOUT ==================== ");
    
    System.out.println("accessToken = " + accessToken);
    
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
