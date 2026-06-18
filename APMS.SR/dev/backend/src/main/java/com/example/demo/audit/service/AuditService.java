package com.example.demo.audit.service;

import com.example.demo.audit.domain.Audit;
import com.example.demo.audit.domain.AuditAction;
import com.example.demo.audit.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditService {

    private final AuditRepository auditRepository;

    public void log(Long userId, AuditAction action, Long targetId) {

        Audit audit = Audit.create(
                userId,
                action,
                targetId
        );

        auditRepository.save(audit);
    }
}
