package com.example.demo.iam.role.service;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.HashSet;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Transactional
public class RolePermissionService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public void assignPermissions(Long roleId, java.util.List<Long> permissionIds) {

        Set<Long> uniqueIds = new HashSet<>(
                Optional.ofNullable(permissionIds)
                        .orElseThrow(() -> new IllegalArgumentException("permissionIds required"))
        );

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        Set<Permission> permissions =
                new HashSet<>(permissionRepository.findAllById(uniqueIds));

        if (permissions.size() != uniqueIds.size()) {
            throw new IllegalArgumentException("Some permissions not found");
        }

        role.setPermissions(permissions);
    }
}
