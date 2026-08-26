package com.example.demo.iam.role.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RolePermissionRequest(
        @NotNull
        List<Long> permissionIds
) {
}
