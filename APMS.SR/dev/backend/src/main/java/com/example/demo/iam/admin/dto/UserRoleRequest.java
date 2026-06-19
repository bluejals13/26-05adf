package com.example.demo.iam.admin.dto;

import java.util.List;

public record UserRoleRequest(
        List<Long> roleIds
) {
}
