package com.example.demo.iam.user.service;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.MeResponse;
import com.example.demo.iam.user.dto.UpdatePasswordRequest;

import com.example.demo.iam.user.repository.UserRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.permission.domain.Permission;

import com.example.demo.common.exception.UserNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    
    // 회원가입
    @Transactional
    public UserResponse signup(SignupRequest req) {

        if (userRepository.existsByUsername(req.username())) {
            throw new DuplicateUserException("이미 존재하는 유저");
        }

        User user = new User(
                req.username(),
                passwordEncoder.encode(req.password())
        );

        User saved = userRepository.save(user);

        return new UserResponse(saved.getId(), saved.getUsername());
    }


    

    // 내 정보 조회
    public MeResponse getMe(Long userId) {

        User user = userRepository.findWithRolesById(userId)
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
    
        

    // 비밀번호 변경
    @Transactional
    public void updatePassword(Long userId, UpdatePasswordRequest req) {

        User user = getUser(userId);

        if (req.password().length() < 8) {
            throw new IllegalArgumentException("PASSWORD_TOO_SHORT");
        }

        user.updatePassword(passwordEncoder.encode(req.password()));

        redisTemplate.delete(ACCESS_KEY + userId);
        redisTemplate.delete(REFRESH_KEY + userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));
    }
}
