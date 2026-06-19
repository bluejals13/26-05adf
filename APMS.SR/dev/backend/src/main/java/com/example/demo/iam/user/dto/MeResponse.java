package com.example.demo.iam.user.dto;

import java.util.List;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.permission.domain.Permission;

public record MeResponse(
    Long id,
    String username,
    List<String> roles,
    List<String> permissions
) {}
