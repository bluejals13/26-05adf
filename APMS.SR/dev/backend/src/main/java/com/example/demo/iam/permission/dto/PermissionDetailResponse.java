package com.example.demo.iam.permission.dto;

import java.util.List;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleDto;
import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.UserDto;

public record PermissionDetailResponse(
    Long id,
    String name,
    String description,
    List<RoleDto> roles,
    List<UserDto> users
) {

    public static PermissionDetailResponse from(
            Permission permission,
            List<Role> roles,
            List<User> users
    ) {

        return new PermissionDetailResponse(
                permission.getId(),
                permission.getName(),
                permission.getDescription(),
                roles.stream()
                        .map(RoleDto::from)
                        .toList(),
                users.stream()
                        .map(UserDto::from)
                        .toList()
        );
    }
}
