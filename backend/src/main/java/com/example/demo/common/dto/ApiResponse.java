// backend/src/main/java/com/example/demo/common/dto/ApiResponse.java
package com.example.demo.common.dto;

public record ApiResponse<T>(
        String status,
        String message,
        T data
) {
    // 성공 시 데이터 반환
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("SUCCESS", "요청이 성공적으로 처리되었습니다.", data);
    }

    // 성공 시 메시지만 반환 (데이터 없음)
    public static ApiResponse<Void> success(String message) {
        return new ApiResponse<>("SUCCESS", message, null);
    }

    // 에러 발생 시 반환
    public static ApiResponse<Void> error(String message) {
        return new ApiResponse<>("ERROR", message, null);
    }
}