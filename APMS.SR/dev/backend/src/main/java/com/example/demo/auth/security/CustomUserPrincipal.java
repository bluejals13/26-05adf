package com.example.demo.auth.security;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomUserPrincipal {
    implements UserDetails{

        private final Long userId;

        @Override
        public Collection<? extends GranteAuthority> getAuthorities(){
            return Authorities; }

        @Override
        public String getUsername(){
            return userId.toString(); }

        @Override
        public boolean isEnabled(){
            return true; }
}
