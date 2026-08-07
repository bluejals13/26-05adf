package com.example.demo.auth.security;

import com.example.demo.iam.user.dto.LoginResponse;
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
import org.springframework.security.authentication.BadCredentialsException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthService authService;
    
    


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        
        LoginResult result = authService.login(req);

        response.addCookie(
                createRefreshCookie(result.refreshToken())
        );

        return ResponseEntity.ok(
                new LoginResponse(
                        result.accessToken(),
                        result.grantType()
                )
        );
    }
    
    
    
    

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        LoginResult token =
                authService.refresh(
                        extractRefreshToken(request)
                );

        response.addCookie(
                createRefreshCookie(token.refreshToken())
        );
        
        //나중에 slf4j 로그 추가 할 곳

        return ResponseEntity.ok(
            new LoginResponse(        // dto 로 은닉 할 것,
                token.accessToken(),
                token.grantType()
        ));
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
        cookie.setSecure(true);        // 개발:false , 운영:true
        cookie.setPath("/");
        cookie.setMaxAge(0);

        response.addCookie(cookie);

        return ResponseEntity.noContent().build();
}
    
    
    
    
    private Cookie createRefreshCookie(String token) {
        
        if (token == null || token.isBlank()) {        // 리프레시 토큰 Null,
            throw new IllegalArgumentException(
                "Refresh token is empty"
            );
        }

        Cookie cookie = new Cookie( "refreshToken", token );

        cookie.setHttpOnly(true);
        cookie.setSecure(true);        // 개발:false , 운영:true
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);

        return cookie;
    }
    
    
    
    private String extractRefreshToken(HttpServletRequest request) {

        if (request.getCookies() == null) { throw new BadCredentialsException("REFRESH_TOKEN_NOT_FOUND"); }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) { return cookie.getValue(); }
        }

        throw new BadCredentialsException("REFRESH_TOKEN_NOT_FOUND");
    }
    
    
    

    private String extractAccessToken(HttpServletRequest request) {
    
        String header = request.getHeader("Authorization");
    
        if(header == null || !header.startsWith("Bearer ")) {
            throw new BadCredentialsException("ACCESS_TOKEN_NOT_FOUND");
        }
        return header.substring(7);
    }
    
}
