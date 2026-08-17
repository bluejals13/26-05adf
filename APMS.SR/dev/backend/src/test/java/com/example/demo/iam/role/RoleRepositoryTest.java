package com.example.demo.iam.role;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;

import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Set;

@DataJpaTest
@ActiveProfiles("test")
class RoleRepositoryTest {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Test
    void Role과_Permission_관계를_저장하고_조회한다() {

        Permission permission =
                new Permission(
                        "TEST_READ",
                        "테스트 조회"
                );

        permissionRepository.save(permission);

        Role role =
                Role.create(
                        "TEST_ROLE",
                        "테스트 Role"
                );

        role.setPermissions(Set.of(permission));

        roleRepository.saveAndFlush(role);

        var result =
                roleRepository.findAllWithPermissions();

        assertThat(result).isNotEmpty();

        Role saved = result.stream()
                .filter(r -> r.getName().equals("TEST_ROLE"))
                .findFirst()
                .orElseThrow();

        assertThat(saved.getPermissions())
                .extracting(Permission::getName)
                .contains("TEST_READ");
    }

    @Test
    void Permission을_사용하는_Role을_조회한다() {

        Permission permission =
                new Permission(
                        "ROLE_TEST_READ",
                        "Role 테스트 조회"
                );

        permissionRepository.save(permission);

        Role role =
                Role.create(
                        "TEST_ROLE",
                        "테스트 Role"
                );

        role.setPermissions(Set.of(permission));

        roleRepository.saveAndFlush(role);

        var roles =
                roleRepository.findByPermissionId(permission.getId());

        assertThat(roles)
                .extracting(Role::getName)
                .contains("TEST_ROLE");
    }
}
