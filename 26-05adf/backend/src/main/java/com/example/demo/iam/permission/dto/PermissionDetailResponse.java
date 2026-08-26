package com.example.demo.iam.permission.dto;

import java.util.List;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleDto;

public record PermissionDetailResponse(
        Long id,
        String name,
        String description,
        List<RoleDto> roles
) {

    public static PermissionDetailResponse from(
            Permission permission,
            List<Role> roles
    ) {

        return new PermissionDetailResponse(
                permission.getId(),
                permission.getName(),
                permission.getDescription(),
                roles.stream()
                        .map(RoleDto::from)
                        .toList()
        );
    }
}
