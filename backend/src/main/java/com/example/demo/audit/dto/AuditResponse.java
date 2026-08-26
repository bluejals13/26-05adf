package com.example.demo.audit.dto;

import com.example.demo.audit.domain.Audit;

import java.time.LocalDateTime;

public record AuditResponse(
        Long id,
        Long userId,
        String action,
        LocalDateTime createdAt
) {
    public static AuditResponse from(Audit audit) {
        return new AuditResponse(
                audit.getId(),
                audit.getUserId(),
                audit.getAction().name(),
                audit.getCreatedAt()
        );
    }
}
