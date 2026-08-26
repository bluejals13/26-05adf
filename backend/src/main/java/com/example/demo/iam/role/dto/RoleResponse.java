package com.example.demo.iam.role.dto;

import com.example.demo.iam.permission.dto.PermissionResponse;
import com.example.demo.iam.role.domain.Role;

import java.util.Set;
import java.util.stream.Collectors;

public record RoleResponse(
        Long id,
        String name,
        String description,
        Set<PermissionResponse> permissions
) {
    public static RoleResponse from(Role role) {
        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getPermissions().stream()
                        .map(PermissionResponse::from)
                        .collect(Collectors.toSet())
        );
    }
}
