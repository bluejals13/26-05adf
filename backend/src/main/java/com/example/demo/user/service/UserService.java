package com.example.demo.user.service;

import com.example.demo.user.domain.User;
import com.example.demo.user.dto.*;
import com.example.demo.user.security.*;
import com.example.demo.user.exception.DuplicateUserException;
import com.example.demo.user.exception.UserNotFoundException;
import com.example.demo.user.jwt.JwtProvider;
import com.example.demo.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 회원가입
    public UserResponse signup(SignupRequest req) {

        if (userRepository.findByUsername(req.username()).isPresent()) {
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
    public LoginResponse login(LoginRequest req) {

        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException("INVALID_CREDENTIALS");
        }

        String accessToken = jwtProvider.createToken(user.getId(), user.getUsername());

        return new LoginResponse(accessToken, "Bearer");
    }

    // 내 정보 조회
    public UserResponse getMe(Long userId) {

        User user = getUser(userId);

        return new UserResponse(user.getId(), user.getUsername());
    }

    // 비밀번호 변경
    @Transactional
    public void updatePassword(Long userId, UpdatePasswordRequest req) {

        User user = getUser(userId);

        if (req.password().length() < 8) {
            throw new IllegalArgumentException("PASSWORD_TOO_SHORT");
        }

        user.updatePassword(passwordEncoder.encode(req.password()));
    }

    // 내부 공통 메서드
    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("유저 없음"));
    }
}
