package com.example.demo.iam.admin.user.dto;

import java.util.List;

public record UserRoleRequest(
        List<Long> roleIds
) {
}