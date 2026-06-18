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
    public LoginResult login(LoginRequest req) {        
        
        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }
                
        System.out.println("password raw = " + req.password());
        System.out.println("password db  = " + user.getPassword());
        
        System.out.println("match = " + passwordEncoder.matches(req.password(), user.getPassword()));
        // 접근 과 redis 연결 가
        String accessToken = jwtProvider.createAccessToken(user.getId(), user.getUsername());
        String jti = jwtProvider.getJti(accessToken);

        redisTemplate.opsForValue().set(
            "active-jti:" + user.getId(),
            jti,
            Duration.ofMinutes(30)
            );
        
        // 접근 과 redis 연결 나
        // 리프레시 와 redis 연결 가
        String refreshToken = jwtProvider.createRefreshToken(user.getId());
        
        // redisTemplate.delete("refresh:" + user.getId()); // 기존 세션 제거 (명확하게)

        redisTemplate.opsForValue().set( // 새 세션 저장
            "refresh:" + user.getId(),
            refreshToken,
            Duration.ofMinutes(30)
        );
        // 리프레시 와 redis 연결 나
        
        return new LoginResult(accessToken, "Bearer", refreshToken);
    }

    // 내 정보 조회
    // 로그인 및 보안 컨텍스트 용 유저반응 겟미
    public MeResponse getMe(Long userId) {

        User user = userRepository.findWithRolesById(userId)
            .orElseThrow(() -> new UserNotFoundException("유저 없음"));
        
            // 롤 퍼미션 관리자 용 미반응 겟미
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
        
        redisTemplate.delete("active-jti:" + userId);
        redisTemplate.delete("refresh:" + userId);
        
    }

    // 내부 공통 메서드
    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));
    }
}
