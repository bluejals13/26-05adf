package com.example.demo.audit.dto;

import com.example.demo.audit.domain.Audit;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class AuditResponse {

    private Long id;
    private Long userId;
    private String action;
    private LocalDateTime createdAt;

    public static AuditResponse from(Audit audit) {
        return new AuditResponse(
                audit.getId(),
                audit.getUserId(),
                audit.getAction().name(),
                audit.getCreatedAt()
        );
    }
}
