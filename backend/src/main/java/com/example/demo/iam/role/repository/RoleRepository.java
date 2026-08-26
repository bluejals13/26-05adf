package com.example.demo.iam.role.repository;

import com.example.demo.iam.role.domain.Role;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.List;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
    @EntityGraph(attributePaths = "permissions")
    @Query("select r from Role r")
    List<Role> findAllWithPermissions();    // Role 목록 + Permission 조회
    
    @EntityGraph(attributePaths = "permissions")
    Optional<Role> findWithPermissionsById(Long id); // 단건 Role + Permission 페치 조인 조회

    @Query("""
        select distinct r
        from Role r
        join r.permissions p
        where p.id = :permissionId
    """)
    List<Role> findByPermissionId(Long permissionId); // Permission 상세의 사용 Role 조회
}
