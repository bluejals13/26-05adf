package com.example.demo.common.exception;

public class DuplicateUserException extends RuntimeException {
    public DuplicateUserException(String msg) {
        super(msg);
    }
}
