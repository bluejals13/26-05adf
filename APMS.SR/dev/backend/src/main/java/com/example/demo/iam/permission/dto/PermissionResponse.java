package com.example.demo.iam.permission.dto;

import com.example.demo.iam.permission.domain.Permission;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PermissionResponse {

    private Long id;
    private String name;
    private String description;

    public static PermissionResponse from(Permission p) {
        return new PermissionResponse(
                p.getId(),
                p.getName(),
                p.getDescription()
        );
    }
}
