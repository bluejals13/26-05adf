// AuditAdminService

package com.example.demo.audit.service;

import com.example.demo.audit.domain.Audit;
import com.example.demo.audit.repository.AuditRepository;
import com.example.demo.audit.dto.AuditResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional(readOnly = true)
@Service
@RequiredArgsConstructor
public class AuditAdminService {

    private final AuditRepository auditRepository;

    public List<AuditResponse> getAudits(Long userId, String action) {

        List<Audit> audits;

        if (userId != null && action != null) {
            audits = auditRepository.findByUserIdAndAction(userId, action);
        } else if (userId != null) {
            audits = auditRepository.findByUserId(userId);
        } else if (action != null) {
            audits = auditRepository.findByAction(action);
        } else {
            audits = auditRepository.findAll();
        }

        return audits.stream()
                .map(AuditResponse::from)
                .toList();
    }

    public AuditResponse getAudit(Long id) {
        Audit audit = auditRepository.findById(id)
                .orElseThrow();

        return AuditResponse.from(audit);
    }
}
