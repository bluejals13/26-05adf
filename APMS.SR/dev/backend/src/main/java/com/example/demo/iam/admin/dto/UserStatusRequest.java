package com.example.demo.iam.admin.dto;

import com.example.demo.iam.user.domain.UserStatus;

public record UserStatusRequest(
        UserStatus status
) {
}
