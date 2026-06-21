package com.example.demo.iam.user.service;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.dto.*;
import com.example.demo.auth.security.*;
//--
import com.example.demo.common.exception.DuplicateUserException;
import com.example.demo.common.exception.UserNotFoundException;
//--
//--
import com.example.demo.auth.jwt.JwtProvider;
//--
import com.example.demo.iam.user.repository.UserRepository;
//--
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.permission.domain.Permission;
//--
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.redis.core.RedisTemplate;

import java.time.Duration; // 시간
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final RedisTemplate<String, String> redisTemplate;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    
    private static final String ACCESS_KEY = "auth:access:";
    private static final String REFRESH_KEY = "auth:refresh:";
    
    
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
    
    // 로그아웃 redis 초기화
    public void logout(Long userId) {
    
        redisTemplate.delete( ACCESS_KEY + userId );
    
        redisTemplate.delete( REFRESH_KEY + userId );
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
