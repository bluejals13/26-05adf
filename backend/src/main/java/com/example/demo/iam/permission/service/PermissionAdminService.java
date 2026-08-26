package com.example.demo.iam.permission.service;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.dto.PermissionDetailResponse;
import com.example.demo.iam.permission.dto.PermissionResponse;
import com.example.demo.iam.permission.repository.PermissionRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PermissionAdminService {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;

    public List<PermissionResponse> getPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(PermissionResponse::from)
                .toList();
    }

    public PermissionDetailResponse getPermissionDetail(Long id) {

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Permission not found"));

        List<Role> roles = roleRepository.findByPermissionId(id);

        return PermissionDetailResponse.from(permission, roles);
    }
}
