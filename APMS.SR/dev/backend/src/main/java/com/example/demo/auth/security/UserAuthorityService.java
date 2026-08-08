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
        System.out.println("===== getAuthorities START =====");
        System.out.println("userId = " + userId);
    public List<GrantedAuthority> getAuthorities(Long userId) {

        User user = userRepository.findWithRolesAndPermissionsById(userId)
                .orElseThrow(() -> {
                    System.out.println("USER NOT FOUND");
                return new BadCredentialsException("INVALID_CREDENTIALS");
            });

            System.out.println("USER FOUND = " + user.getUsername());
            System.out.println("STATUS = " + user.getStatus());
            System.out.println("ROLES = " + user.getRoles().size());

        // 사용자 상태 검증
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new BadCredentialsException("USER_NOT_ACTIVE");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();

        // ROLE 추가
        user.getRoles().forEach(role -> {
                System.out.println("ROLE = " + role.getName());

            authorities.add(
                new SimpleGrantedAuthority("ROLE_" + role.getName())
            );

            role.getPermissions().forEach(permission -> {
                    System.out.println(
                    "PERMISSION = " + permission.getName()
            );

            authorities.add(
                new SimpleGrantedAuthority(permission.getName())
            );
        });
    });

        System.out.println("AUTHORITIES = " + authorities);
        System.out.println("===== getAuthorities END =====");


        return List.copyOf(authorities);
    }
}
