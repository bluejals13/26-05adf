package com.example.demo.iam.role.dto;

import java.util.List;

public record RolePermissionRequest(
        List<Long> permissionIds
) {}