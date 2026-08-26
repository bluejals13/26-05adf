package com.example.demo.iam.role;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;
import com.example.demo.iam.role.service.RolePermissionService;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RolePermissionIntegrationTest {

    @Autowired
    private RolePermissionService rolePermissionService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    private Role role;
    private Permission userRead;
    private Permission userDelete;

    @BeforeEach
    void setUp() {

        role = roleRepository.findAll()
                .stream()
                .filter(r -> r.getName().equals("USER"))
                .findFirst()
                .orElseThrow();

        userRead = permissionRepository.findByName("USER_READ")
                .orElseThrow();

        userDelete = permissionRepository.findByName("USER_DELETE")
                .orElseThrow();
    }

    @Test
    void Role에_새로운_Permission을_할당한다() {

        rolePermissionService.assignPermissions(
                2L,
                role.getId(),
                List.of(userRead.getId(), userDelete.getId())
        );

        Role result = roleRepository.findById(role.getId())
                .orElseThrow();

        assertThat(result.getPermissions())
                .extracting(Permission::getName)
                .containsExactlyInAnyOrder(
                        "USER_READ",
                        "USER_DELETE"
                );
    }

    @Test
    void 기존_Permission이_새로운_Permission으로_교체된다() {

        rolePermissionService.assignPermissions(
                2L,
                role.getId(),
                List.of(userDelete.getId())
        );

        Role result = roleRepository.findById(role.getId())
                .orElseThrow();

        assertThat(result.getPermissions())
                .extracting(Permission::getName)
                .containsExactly("USER_DELETE");
    }

    @Test
    void 중복된_Permission_ID는_하나로_처리된다() {

        rolePermissionService.assignPermissions(
                2L,
                role.getId(),
                List.of(
                        userRead.getId(),
                        userRead.getId(),
                        userDelete.getId()
                )
        );

        Role result = roleRepository.findById(role.getId())
                .orElseThrow();

        assertThat(result.getPermissions())
                .extracting(Permission::getName)
                .containsExactlyInAnyOrder(
                        "USER_READ",
                        "USER_DELETE"
                );
    }

    @Test
    void 존재하지_않는_Permission이_포함되면_실패한다() {

        Long invalidPermissionId = 999999L;

        assertThatThrownBy(() ->
                rolePermissionService.assignPermissions(
                        2L,
                        role.getId(),
                        List.of(
                                userRead.getId(),
                                invalidPermissionId
                        )
                )
        )
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Some permissions not found");
    }

    @Test
    void 존재하지_않는_Role이면_실패한다() {

        assertThatThrownBy(() ->
                rolePermissionService.assignPermissions(
                        2L,
                        999999L,
                        List.of(userRead.getId())
                )
        )
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Role not found");
    }
}
