package com.example.demo.iam.user.domain;

public enum UserStatus {
    ACTIVE,            // 일반 로그인 허용
    SUSPENDED,         // 로그인 불가 / 강제 로그아웃 X
    DELETE_PENDING,    // 삭제 대기
    DELETED            // 아직 구현 중 삭제
}
