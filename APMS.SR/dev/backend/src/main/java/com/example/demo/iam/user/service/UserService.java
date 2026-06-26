package com.example.demo.iam.user.service;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.MeResponse;
import com.example.demo.iam.user.dto.UpdatePasswordRequest;
import com.example.demo.iam.user.dto.SignupRequest;
import com.example.demo.iam.user.dto.UserResponse;
import com.example.demo.iam.user.repository.UserRepository;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.common.exception.DuplicateUserException;
import com.example.demo.common.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String ACCESS_KEY = "auth:access:";
    private static final String REFRESH_KEY = "auth:refresh:";

    @Transactional
    public UserResponse signup(SignupRequest req) {

        if (userRepository.existsByUsername(req.username())) {
            throw new DuplicateUserException("이미 존재하는 유저");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new DuplicateUserException("이미 사용된 이메일");
        }

        User user = new User(
                req.username(),
                passwordEncoder.encode(req.password()),
                req.email(),
        );

        User saved = userRepository.save(user);

        return new UserResponse(saved.getId(), saved.getUsername(), saved.email());
    }

    public MeResponse getMe(Long userId) {

        User user = userRepository.findWithRolesAndPermissionsById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));

        List<String> roles = user.getRoles()
                .stream()
                .map(Role::getName)
                .toList();

        List<String> permissions = user.getRoles()
                .stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(Permission::getName)
                .distinct()
                .toList();

        return new MeResponse(
                user.getId(),
                user.getUsername(),
                roles,
                permissions
        );
    }

    @Transactional
    public void updatePassword(Long userId, UpdatePasswordRequest req) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));

        if (req.password().length() < 8) {
            throw new IllegalArgumentException("PASSWORD_TOO_SHORT");
        }

        user.updatePassword(passwordEncoder.encode(req.password()));

        redisTemplate.delete(ACCESS_KEY + userId);
        redisTemplate.delete(REFRESH_KEY + userId);
    }
}
