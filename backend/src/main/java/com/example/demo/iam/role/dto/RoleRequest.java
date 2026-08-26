package com.example.demo.iam.role.dto;

import jakarta.validation.constraints.NotBlank;

public record RoleRequest(
        @NotBlank(message = "역할명은 필수입니다.")
        String name,
        String description
) {}
