package com.example.demo.auth.security;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAuthorityService {

    private final UserRepository userRepository;

    public List<GrantedAuthority> getAuthorities(Long userId) {

        User user = userRepository.findWithRolesAndPermissionsById(userId)    //여기서 UserStatus.ACTIVE 검증 시 즉시 모든 요청 차단
                .orElseThrow();

        Set<GrantedAuthority> authorities = new ArrayList<>();

        user.getRoles().forEach(r ->
                authorities.add(new SimpleGrantedAuthority("ROLE_" + r.getName()))
        );

        user.getRoles().forEach(r ->
                r.getPermissions().forEach(p ->
                        authorities.add(new SimpleGrantedAuthority(p.getName()))
                )
        );

        return authorities;
    }
}
