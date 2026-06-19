package com.example.demo.common.exception;

import lombok.extern.slf4j.Slf4j;
import com.example.demo.common.exception.DuplicateUserException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.authentication.BadCredentialsException;

import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // 회원 중복
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity
                .status(400)
                .body(Map.of("message", e.getMessage()));
    }

    // 게스트의 리프레시 계정 정보 me 오류
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body(Map.of(
            "message", "UNAUTHORIZED",
            "detail", e.getMessage()
        ));
    }

    // 나머지 모든 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception e) {
        log.error("SERVER ERROR", e);

        return ResponseEntity
                .status(500)
                .body(Map.of(
                        "message", e.getClass().getSimpleName(),
                        "detail", e.getMessage()
                ));
    }

    // null 값 예외 처리
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<?> handleNPE(NullPointerException e) {
        return ResponseEntity
                .status(400)
                .body(Map.of("message", "NULL_INPUT"));
    }


}
