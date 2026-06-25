// AuditAdminController

package com.example.demo.audit;

import com.example.demo.audit.dto.AuditResponse;
import com.example.demo.audit.service.AuditAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audits")
@RequiredArgsConstructor
public class AuditAdminController {

    private final AuditAdminService auditAdminService;
    
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    @GetMapping
    public List<AuditResponse> getAudits(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action
    ) {
        return auditAdminService.getAudits(userId, action);
    }
    
    @PreAuthorize("hasAuthority('AUDIT_READ')")
    @GetMapping("/{id}")
    public AuditResponse getAudit(@PathVariable Long id) {
        return auditAdminService.getAudit(id);
    }
}
