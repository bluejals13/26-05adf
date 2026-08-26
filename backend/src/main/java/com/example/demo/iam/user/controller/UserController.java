package com.example.demo.iam.user.controller;

import com.example.demo.iam.user.dto.UserResponse;
import com.example.demo.iam.user.dto.MeResponse;
import com.example.demo.iam.user.dto.SignupRequest;
import com.example.demo.iam.user.dto.UpdatePasswordRequest;
import com.example.demo.common.dto.ApiResponse;
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
    public ApiResponse<UserResponse> signup(@RequestBody SignupRequest req) {
        return ApiResponse.success(userService.signup(req));
    }
    
    @GetMapping("/me")
    public ApiResponse<MeResponse> me(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ApiResponse.success(userService.getMe(principal.getUserId()));
    }

    @PatchMapping("/me/password")
    public ApiResponse<Void> updatePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdatePasswordRequest req
    ) {
        userService.updatePassword(principal.getUserId(), req);
        return ApiResponse.<Void>success(null, "비밀번호 변경에 성공했습니다.");
    }
}
