package com.example.demo.iam.user.dto;

public record LoginResult(
        String accessToken,
        String grantType,
        String sessionId
) {}
