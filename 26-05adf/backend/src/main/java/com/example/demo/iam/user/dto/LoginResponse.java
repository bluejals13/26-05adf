package com.example.demo.iam.user.dto;

public record LoginResponse(
        String accessToken,
        String grantType
) {}
