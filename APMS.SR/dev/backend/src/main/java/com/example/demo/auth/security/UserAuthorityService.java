package com.example.demo.auth.security;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.domain.UserStatus;
import com.example.demo.iam.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserAuthorityService {

    private final UserRepository userRepository;

    public List<GrantedAuthority> getAuthorities(Long userId) {

        User user = userRepository.findWithRolesAndPermissionsById(userId)
                .orElseThrow(() -> new BadCredentialsException("INVALID_CREDENTIALS"));

        // 사용자 상태 검증
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadCredentialsException("USER_NOT_ACTIVE");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();

        // ROLE 추가
        user.getRoles().forEach(role ->
                authorities.add(
                        new SimpleGrantedAuthority("ROLE_" + role.getName())
                )
        );

        // Permission 추가
        user.getRoles().forEach(role ->
                role.getPermissions().forEach(permission ->
                        authorities.add(
                                new SimpleGrantedAuthority(permission.getName())
                        )
                )
        );

        return List.copyOf(authorities);
    }
}
