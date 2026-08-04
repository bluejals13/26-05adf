package com.example.demo.auth.security;

import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
    


    @PostMapping("/login")
    public ResponseEntity<LoginResult> login(
            @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        
        LoginResult result = authService.login(req);

        response.addCookie(
                createRefreshCookie(result.refreshToken())
        );

        return ResponseEntity.ok(
                new LoginResult(
                        result.accessToken(),
                        result.grantType(),
                        null
                )
        );
    }
    
    
    
    

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        TokenResponse token =
                authService.refresh(
                        extractRefreshToken(request)
                );

        response.addCookie(
                createRefreshCookie(token.refreshToken())
        );
        
        //나중에 slf4j 로그 추가 할 곳

        return ResponseEntity.ok(token);
    }
    
    
    
    
    

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response
) {

        authService.logout(
                extractAccessToken(request)
        );

        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.noContent().build();
}
    
    
    
    
    private Cookie createRefreshCookie(String token) {

        Cookie cookie = new Cookie( "refreshToken", token );

        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);

        return cookie;
    }
    
    
    
    private String extractRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null) { return null; }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) { return cookie.getValue(); }
        }

        return null;
    }
    
    
    

    private String extractAccessToken(HttpServletRequest request) {

        String header = request.getHeader("Authorization");
        return header != null && header.startsWith("Bearer ")
                ? header.substring(7)
                : null;
    }
}
