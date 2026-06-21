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
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return userService.getMe(principal.getUserId());
    }

    @PatchMapping("/me/password")
    public void updatePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdatePasswordRequest req
    ) {
        userService.updatePassword(principal.getUserId(), req);
    }
}
