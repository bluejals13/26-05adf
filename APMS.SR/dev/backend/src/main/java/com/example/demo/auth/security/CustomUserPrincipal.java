package com.example.demo.auth.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomUserPrincipal {
    private final Long userId;
}
