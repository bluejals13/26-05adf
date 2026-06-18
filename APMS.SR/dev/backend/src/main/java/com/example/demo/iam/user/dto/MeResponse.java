package com.example.demo.iam.user.dto;

import java.util.List;
import com.example.demo.admin.role.domain.Role;
import com.example.demo.admin.permission.domain.Permission;

public record MeResponse(
    Long id,
    String username,
    List<String> roles,
    List<String> permissions
) {}
