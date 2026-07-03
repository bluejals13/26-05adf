package com.example.demo.iam.role.dto;

import com.example.demo.iam.permission.dto.PermissionResponse;

import lombok.Builder;
import lombok.Getter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
@Builder
public class RoleResponse {

    private Long id;
    private String name;
    private String description; // ⭐ 추가
    private Set<PermissionResponse> permissions;

    public static RoleResponse from(com.example.demo.iam.role.domain.Role role) {
        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription()) // ⭐ 추가
                .permissions(
                        role.getPermissions().stream()
                                .map(PermissionResponse::from)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}
