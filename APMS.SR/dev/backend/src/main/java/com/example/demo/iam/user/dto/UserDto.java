package com.example.demo.iam.user.dto;

import com.example.demo.iam.user.domain.User;

public record UserDto(
    Long id,
    String username
) {
    public static UserDto from(User user) {
        return new UserDto(
            user.getId(),
            user.getUsername()
        );
    }
}