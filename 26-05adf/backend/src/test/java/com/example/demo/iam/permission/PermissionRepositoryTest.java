package com.example.demo.iam.permission;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
class PermissionRepositoryTest {

    @Autowired
    private PermissionRepository permissionRepository;

    @Test
    void Permission을_저장하고_조회할_수_있다() {
        Permission permission =
                new Permission(
                        "TEST_USER_READ",
                        "테스트 사용자 조회"
                );

        Permission saved =
                permissionRepository.saveAndFlush(permission);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("TEST_USER_READ");
        assertThat(saved.getDescription())
                .isEqualTo("테스트 사용자 조회");
    }

    @Test
    void Permission_전체를_조회할_수_있다() {
        permissionRepository.save(
                new Permission(
                        "TEST_USER_READ",
                        "테스트 사용자 조회"
                )
        );

        permissionRepository.save(
                new Permission(
                        "TEST_ROLE_READ",
                        "테스트 Role 조회"
                )
        );

        permissionRepository.flush();

        List<Permission> permissions =
                permissionRepository.findAll();

        assertThat(permissions)
                .extracting(Permission::getName)
                .contains(
                        "TEST_USER_READ",
                        "TEST_ROLE_READ"
                );
    }

    @Test
    void Permission_ID로_조회할_수_있다() {
        Permission saved =
                permissionRepository.saveAndFlush(
                        new Permission(
                                "TEST_ROLE_ASSIGN",
                                "테스트 Role에 Permission 할당"
                        )
                );

        var result =
                permissionRepository.findById(saved.getId());

        assertThat(result).isPresent();
        assertThat(result.get().getName())
                .isEqualTo("TEST_ROLE_ASSIGN");
        assertThat(result.get().getDescription())
                .isEqualTo("테스트 Role에 Permission 할당");
    }

    @Test
    void 존재하지_않는_ID는_조회되지_않는다() {
        var result =
                permissionRepository.findById(999999L);

        assertThat(result).isEmpty();
    }

    @Test
    void Permission_name은_중복될_수_없다() {
        permissionRepository.saveAndFlush(
                new Permission(
                        "TEST_DUPLICATE",
                        "첫 번째 Permission"
                )
        );

        assertThatThrownBy(
            () -> permissionRepository.saveAndFlush(
                new Permission(
                        "TEST_DUPLICATE",
                        "중복 Permission"
                        )
                )
        ).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void description은_null이어도_저장할_수_있다() {
        Permission saved =
                permissionRepository.saveAndFlush(
                        new Permission(
                                "TEST_PERMISSION",
                                null
                        )
                );

        assertThat(saved.getDescription()).isNull();
    }
}
