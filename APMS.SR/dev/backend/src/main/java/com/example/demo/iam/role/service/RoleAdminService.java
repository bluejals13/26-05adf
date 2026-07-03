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

import java.util.stream.Collectors;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class RoleAdminService {

    private final RoleRepository roleRepository;
    private final AuditService auditService;
    
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
        Role role = Role.create(request.getName());
        roleRepository.save(role);
        
        auditService.log(
                adminId,
                AuditAction.ROLE_UPDATE,
                "ROLE",
                role.getId(),
                null,
                role.getName()
        );
    }

    public void updateRole(Long adminId, Long roleId, RoleRequest request) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        String before = role.getName();
        String beforeDesc = role.getDescription();
        
        role.updateName(request.getName());
        role.setDescription(request.getDescription()); // 추가
        
        auditService.log(
                adminId,
                AuditAction.ROLE_UPDATE,
                "ROLE",
                roleId,
                beforeName + " / " + beforeDesc,
                role.getName() + " / " + role.getDescription()
        );
    }

    public void deleteRole(Long adminId, Long roleId) {
        
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        String before = role.getName();
        
        roleRepository.delete(role);
        
        auditService.log(
                adminId,
                AuditAction.ROLE_DELETE,
                "ROLE",
                roleId,
                before,
                null
        );
    }
}
