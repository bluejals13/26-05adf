package com.example.demo.iam.user.dto;

import jakarta.validation.constraints.NotBlank;

public record SignupRequest(
        String username,
        String password
){}
