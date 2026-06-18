package com.example.demo.iam.permission.repository;

import com.example.demo.admin.permission.domain.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}