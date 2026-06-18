package com.example.demo.iam.admin.user.dto;

import com.example.demo.iam.user.domain.UserStatus;

public record UserStatusRequest(
        UserStatus status
) {
}
