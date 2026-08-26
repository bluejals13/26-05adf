package com.example.demo.iam.role.dto;

import com.example.demo.iam.role.domain.Role;

public record RoleDto(
    Long id,
    String name
) {
    public static RoleDto from(Role role) {
        return new RoleDto(
            role.getId(),
            role.getName()
        );
    }
}