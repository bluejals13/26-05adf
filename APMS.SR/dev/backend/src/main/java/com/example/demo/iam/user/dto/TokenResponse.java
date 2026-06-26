package com.example.demo.iam.user.dto;


public record TokenResponse(
        String accessToken,
        String sessionId
) {}
