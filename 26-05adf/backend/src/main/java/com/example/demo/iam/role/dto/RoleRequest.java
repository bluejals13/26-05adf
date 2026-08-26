package com.example.demo.iam.role.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {
    private String name;
    private String description;  // 추가
}
