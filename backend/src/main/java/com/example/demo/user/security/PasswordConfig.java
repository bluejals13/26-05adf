package com.example.demo.user.security;

import java.util.Map;
import java.util.HashMap;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;

@Configuration
public class PasswordConfig {

@Bean
public PasswordEncoder passwordEncoder() {
    String idForEncode = "noop";

    Map<String, PasswordEncoder> encoders = new HashMap<>();
    encoders.put("bcrypt", new BCryptPasswordEncoder());
    encoders.put("noop", NoOpPasswordEncoder.getInstance());

    return new DelegatingPasswordEncoder(idForEncode, encoders);
}

}
