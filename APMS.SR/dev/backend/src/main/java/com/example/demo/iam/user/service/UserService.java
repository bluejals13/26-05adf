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

    // 로그인
    @Transactional
    public LoginResult login(LoginRequest req) {

        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }

        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String jti = jwtProvider.getJti(accessToken);

        redisTemplate.opsForValue().set(
                "auth:access:" + user.getId(),
                jti,
                Duration.ofMinutes(30)
        );

        String refreshToken = jwtProvider.createRefreshToken(user.getId());

        redisTemplate.opsForValue().set(
                "auth:refresh:" + user.getId(),
                refreshToken,
                Duration.ofDays(7)
        );

        return new LoginResult(accessToken, "Bearer", refreshToken);
    }

    // 로그인 결과 리프레시 관련 로직
    public LoginResult refresh(String refreshToken) {

        validate(refreshToken);
    
        Long userId = jwtProvider.getUserId(refreshToken);
    
        String newAccess = jwtProvider.createAccessToken(userId);
    
        String newRefresh = jwtProvider.createRefreshToken(userId);
    
        redisTemplate.opsForValue().set(
                "auth:refresh:" + userId,
                newRefresh,
                Duration.ofDays(7)
        );
    
        return new LoginResult(
                newAccess,
                "Bearer",
                newRefresh
        );
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

        redisTemplate.delete("auth:access:" + userId);
        redisTemplate.delete("auth:refresh:" + userId);
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));
    }
}
