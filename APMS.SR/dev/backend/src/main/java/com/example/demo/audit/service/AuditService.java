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

     public void log(AuditEvent event) {

        Audit audit = Audit.create(
            event.getUserId(),
            event.getAction(),
            event.getTargetType(),
            event.getTargetId(),
            event.getBeforeValue(),
            event.getAfterValue()
        );
    
        auditRepository.save(audit);
    }
}
