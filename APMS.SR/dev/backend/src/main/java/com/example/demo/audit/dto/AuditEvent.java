package com.example.demo.audit.event;

import com.example.demo.audit.domain.AuditAction;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuditEvent {

    private Long userId;
    private AuditAction action;
    private String targetType;
    private Long targetId;
    private String beforeValue;
    private String afterValue;
}
