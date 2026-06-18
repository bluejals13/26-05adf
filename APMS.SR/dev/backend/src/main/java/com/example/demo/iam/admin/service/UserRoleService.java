package com.example.demo.iam.admin.user.service;

import com.example.demo.iam.user.domain.User;
import com.example.demo.iam.user.repository.UserRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import com.example.demo.audit.domain.AuditAction;
import com.example.demo.audit.service.AuditService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserRoleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditService auditService;

    @Transactional
    public void assignRoles(
        Long adminId,
        Long userId,
        List<Long> roleIds
    ) {

        User user = userRepository.findById(userId)
            .orElseThrow();

        Set<Role> roles = new HashSet<>(
            roleRepository.findAllById(roleIds)
        );

        if (roles.size() != roleIds.size()) {
            throw new IllegalArgumentException("Role not found");
        }

        user.setRoles(roles);

        auditService.log(
            adminId,
            AuditAction.ROLE_ASSIGN,
            userId
        );
    }
}
