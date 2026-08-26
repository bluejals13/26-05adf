package com.example.demo.iam.permission.dto;

import com.example.demo.iam.permission.domain.Permission;

public record PermissionResponse(
        Long id,
        String name,
        String description
) {
    public static PermissionResponse from(Permission p) {
        return new PermissionResponse(
                p.getId(),
                p.getName(),
                p.getDescription()
        );
    }
}
