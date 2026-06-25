package com.example.demo.iam.role.repository;

import com.example.demo.iam.role.domain.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
    @EntityGraph(attributePaths = "permissions")
    @Query("select r from Role r")
    List<Role> findAllWithPermissions();    // 순수 퍼미션 조회
    
    @Query("""
        select r
        from Role r
        join r.permissions p
        where p.id = :permissionId
    """)
    List<Role> findByPermissionId(Long permissionId); // 세부 페널 표시용
}
