package com.example.demo.iam.user.dto;

public record UserResponse(
        Long id,
        String username,
        String email
) {}
