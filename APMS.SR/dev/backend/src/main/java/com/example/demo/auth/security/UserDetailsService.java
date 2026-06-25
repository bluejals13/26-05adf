package com.example.demo.auth.security;

public List<GrantedAuthority> getAuthorities(Long userId) {

    User user = userRepository.findWithRolesAndPermissionsById(userId)
            .orElseThrow();

    List<GrantedAuthority> authorities = new ArrayList<>();

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