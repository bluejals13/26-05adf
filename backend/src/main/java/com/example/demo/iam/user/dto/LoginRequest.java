package com.example.demo.iam.user.dto;

public record LoginRequest(
        String username,
        String password
) {}
