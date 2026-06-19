package com.example.demo.iam.admin.dto;

import com.example.demo.iam.user.domain.UserStatus;

import java.time.LocalDateTime;

public record AdminUserResponse (
    Long id,
    String username,
    UserStatus status,
    LocalDateTime passwordChangedAt
) {}
