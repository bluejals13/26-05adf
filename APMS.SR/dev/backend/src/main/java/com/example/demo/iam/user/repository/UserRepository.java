package com.example.demo.iam.user.repository;

import com.example.demo.iam.user.domain.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    
    @EntityGraph(attributePaths = {
        "roles",
        "roles.permissions"
    })
    Optional<User> findWithRolesAndPermissionsById(Long id);
    
    @Query("""
            select distinct u
            from User u
            join u.roles r
            join r.permissions p
            where p.id = :permissionId
        """)
        List<User> findByPermissionId(Long permissionId);
}
