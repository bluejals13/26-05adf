package com.example.demo.iam.role.service;
//--
import com.example.demo.audit.domain.AuditAction;
import com.example.demo.audit.service.AuditService;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.dto.RoleResponse;
import com.example.demo.iam.role.repository.RoleRepository;

import com.example.demo.iam.permission.dto.PermissionResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleAdminService {

    private final RoleRepository roleRepository;
    private final AuditService auditService;
    private final ObjectMapper mapper;
    
    public List<RoleResponse> getRoles() {            // 순수 롤 조회 용
        return roleRepository.findAllWithPermissions()
                .stream()
                .map(role -> RoleResponse.builder()
                        .id(role.getId())
                        .name(role.getName())
                        .permissions(
                                role.getPermissions().stream()
                                        .map(PermissionResponse::from)
                                        .collect(Collectors.toSet())
                        )
                        .build()
                )
                .toList();
    }

    public void createRole(Long adminId, RoleRequest request) {
        Role role = Role.create(request.getName(), request.getDescription());
        roleRepository.save(role);
        
        Map<String, Object> after = Map.of(
            "name", role.getName(),
            "description", role.getDescription()
        );
        
        auditService.log(
                adminId,
                AuditAction.ROLE_CREATE,
                "ROLE",
                role.getId(),
                null,
                mapper.writeValueAsString(after)
        );
    }

    public void updateRole(Long adminId, Long roleId, RoleRequest request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        String beforeName = role.getName();
        String beforeDesc = role.getDescription();
        
        role.update(request.getName(), request.getDescription()); // 핵심 변경
        
        Map<String, Object> before = Map.of(
            "name", beforeName,
            "description", beforeDesc
        );
        
        Map<String, Object> after = Map.of(
            "name", role.getName(),
            "description", role.getDescription()
        );
        
        auditService.log(
                adminId,
                AuditAction.ROLE_UPDATE,
                "ROLE",
                roleId,
                mapper.writeValueAsString(before),
                mapper.writeValueAsString(after)
        );
    }

    public void deleteRole(Long adminId, Long roleId) {
        
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        Map<String, Object> before = Map.of(
            "name", role.getName(),
            "description", role.getDescription()
        );
                
        roleRepository.delete(role);
        
        auditService.log(
                adminId,
                AuditAction.ROLE_DELETE,
                "ROLE",
                roleId,
                mapper.writeValueAsString(before),
                mapper.writeValueAsString(Map.of("deleted", true))
        );
    }
}
