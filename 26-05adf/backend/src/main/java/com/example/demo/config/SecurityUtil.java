package com.example.demo.config;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.demo.auth.security.CustomUserPrincipal;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    public Long getUserId() {
        Object principal = SecurityContextHolder.getContext()
        .getAuthentication()
        .getPrincipal();

        if (principal instanceof CustomUserPrincipal p) {
            return p.getUserId();
        }

        throw new IllegalStateException("Invalid authentication");
    }
}
