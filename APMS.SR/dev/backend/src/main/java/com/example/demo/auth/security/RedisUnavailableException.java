package com.example.demo.auth.security;

public class RedisUnavailableException extends RuntimeException {

    public RedisUnavailableException(Throwable cause) {
        super(cause);
    }
}
