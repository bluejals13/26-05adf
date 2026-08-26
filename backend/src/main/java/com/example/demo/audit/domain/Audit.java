package com.example.demo.audit.domain;

import jakarta.persistence.*;
import lombok.Getter;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;      // 누가 했는지
    
    @Enumerated(EnumType.STRING)
    private AuditAction action;   // 무엇을 했는지 (CREATE, DELETE 등)
    
    private String targetType; // 대상 타입

    private Long targetId;    // 대상 ID
    
    private String beforeValue;    // 전 결과

    private String afterValue;     // 후 결과
    
    private LocalDateTime createdAt;
    
    public static Audit create(
            Long userId,
            AuditAction action,
            String targetType,
            Long targetId,
            String beforeValue,
            String afterValue
    ) {
        Audit audit = new Audit();

        audit.userId = userId;
        audit.action = action;
        audit.targetType = targetType;
        audit.targetId = targetId;
        audit.beforeValue = beforeValue;
        audit.afterValue = afterValue;
        audit.createdAt = LocalDateTime.now();

        return audit;
    }
}
