package com.example.demo.user.dto;

public record UpdatePasswordRequest(
    String currentPassword,
    String password
) {}
