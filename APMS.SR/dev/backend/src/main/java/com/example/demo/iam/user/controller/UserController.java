package com.example.demo.iam.user.controller;

import com.example.demo.iam.user.dto.*;
//--
import com.example.demo.auth.security.AuthService;

import com.example.demo.iam.user.service.UserService;

import com.example.demo.auth.security.CustomUserPrincipal;
//--
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Map;

import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    // 회원가입
    @PostMapping("/auth/signup")
    public UserResponse signup(@RequestBody SignupRequest req) {
        return userService.signup(req);
    }

    // 로그인 (쿠키 방식 refresh)
    @PostMapping("/auth/login")
    public LoginResponse login(
            @RequestBody LoginRequest req,
            HttpServletResponse httpResponse
    ) {

        LoginResult result = userService.login(req);

        Cookie cookie = new Cookie("refreshToken", result.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24 * 7);
        cookie.setSecure(true); // 로컬이면 false, HTTPS면 true

        httpResponse.addCookie(cookie);

        return new LoginResponse(
                result.accessToken(),
                result.grantType()
        );
    }

    // refresh
    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refresh( HttpServletRequest request, HttpServletResponse response ) {
         {

            Cookie[] cookies = Optional
                    .ofNullable(request.getCookies())
                    .orElse(new Cookie[0]);

            String refreshToken = Arrays.stream(cookies)
                    .filter(c -> "refreshToken".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
            
            if (refreshToken == null) {
                return ResponseEntity.status(401).body("NO_REFRESH_TOKEN");
            }

           try {  return ResponseEntity.ok(authService.refresh(refreshToken));
                
            }

            

        } catch (Exception e) {
            // 🔥 핵심: 쿠키 삭제
            Cookie cookie = new Cookie("refreshToken", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        
            return ResponseEntity.status(401).body("INVALID_REFRESH_TOKEN");
        }
    }
    // 내 정보 조회
    // 롤 퍼미션 관리자 용 미반응 겟미
    @GetMapping("/users/me")
    public MeResponse getMe(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return userService.getMe(principal.getUserId()); // 로그인 및 보안 컨텍스트 용 유저반응 겟미
    }
        
    // password change
    @PatchMapping("/users/me/password")
    public void updatePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdatePasswordRequest req
    ) {
        userService.updatePassword(principal.getUserId(), req);
    }
    
    // 디버그용
    @GetMapping("/debug/auth")
    public Object debug() {
        Authentication auth =
        SecurityContextHolder.getContext().getAuthentication();

        return Map.of(
            "auth", auth,
            "authorities", auth.getAuthorities(),
            "principal", auth.getPrincipal(),
            "type", auth.getClass().getSimpleName()
        );
    }    
}
