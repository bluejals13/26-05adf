package com.example.demo.iam.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public record TokenResponse(
        String accessToken,
        String refreshToken
) {}
