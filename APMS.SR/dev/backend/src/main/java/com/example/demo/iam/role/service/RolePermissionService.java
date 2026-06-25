package com.example.demo.iam.role.service;

import com.example.demo.audit.domain.AuditAction;
import com.example.demo.audit.service.AuditService;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;
//import java.util.Optional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Transactional
public class RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final AuditService auditService;

    public void assignPermissions(Long adminId, Long roleId, List<Long> permissionIds) {

        Set<Long> uniqueIds = new HashSet<>(
               permissionIds == null
                        ? List.of()
                        : permissionIds
        );

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));
        
        Set<Permission> before = new HashSet<>(role.getPermissions());
        
        Set<Permission> newPermissions =
                new HashSet<>(permissionRepository.findAllById(uniqueIds));

        if (newPermissions.size() != uniqueIds.size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }

        role.setPermissions(permissions);
        
        auditService.log(
                adminId,
                AuditAction.ROLE_PERMISSION_MANAGE,
                "ROLE",
                roleId,
                before.stream()
                        .map(Permission::getName)
                        .sorted()
                        .toList()
                        .toString(),
                newPermissions.stream()
                        .map(Permission::getName)
                        .sorted()
                        .toList()
                        .toString()
        );
    }
}
