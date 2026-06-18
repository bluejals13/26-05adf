package com.example.demo.iam.role.service;
//--
import com.example.demo.audit.domain.AuditAction;
//--
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

    public void createRole(RoleRequest request) {
        Role role = Role.create(request.getName());
        role.updateName(request.getName());
        roleRepository.save(role);
    }

    public void updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        role.updateName(request.getName());
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}
