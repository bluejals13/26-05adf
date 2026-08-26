package com.example.demo.iam.permission;

import static org.assertj.core.api.Assertions.assertThat;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

@SpringBootTest
@ActiveProfiles("test")
class PermissionIntegrationTest {

    @Autowired
    private PermissionRepository permissionRepository;

    @Test
    void Permission_Migration이_정상적으로_적용된다() {

        List<Permission> permissions =
                permissionRepository.findAll();

        assertThat(permissions).isNotEmpty();
    }

    @Test
    void ROLE_ASSIGN_Permission이_존재한다() {

        Permission permission =
                permissionRepository.findAll()
                        .stream()
                        .filter(p ->
                                p.getName().equals("ROLE_ASSIGN"))
                        .findFirst()
                        .orElseThrow();

        assertThat(permission.getDescription())
                .isEqualTo("Role에 Permission 할당");
    }

    @Test
    void 주요_RBAC_Permission이_존재한다() {

        List<String> required = List.of(
                "USER_READ",
                "USER_STATUS_UPDATE",
                "USER_DELETE",

                "ROLE_READ",
                "ROLE_CREATE",
                "ROLE_UPDATE",
                "ROLE_DELETE",
                "ROLE_ASSIGN",

                "MENU_READ",
                "MENU_CREATE",
                "MENU_UPDATE",
                "MENU_DELETE",

                "PERMISSION_READ"
        );

        List<String> actual =
                permissionRepository.findAll()
                        .stream()
                        .map(Permission::getName)
                        .toList();

        assertThat(actual)
                .containsAll(required);
    }
}
