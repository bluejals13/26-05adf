package com.example.demo.iam.user.controller;

import com.example.demo.iam.user.dto.UserResponse;
import com.example.demo.iam.user.dto.MeResponse;
import com.example.demo.iam.user.dto.UpdatePasswordRequest;
import com.example.demo.auth.security.CustomUserPrincipal;
import com.example.demo.iam.user.service.UserService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    
    @PostMapping("/signup")
    public UserResponse signup(@RequestBody SignupRequest req) {
        return userService.signup(req);
    }
    
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
