package com.example.demo.user.exception;

import lombok.extern.slf4j.Slf4j;
import com.example.demo.user.exception.DuplicateUserException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
