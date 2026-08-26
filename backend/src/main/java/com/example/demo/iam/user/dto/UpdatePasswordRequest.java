package com.example.demo.iam.user.dto;

public record UpdatePasswordRequest(
    String currentPassword,
    String password
) {}
