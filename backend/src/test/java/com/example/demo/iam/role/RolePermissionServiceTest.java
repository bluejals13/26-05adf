package com.example.demo.iam.role;

import com.example.demo.audit.service.AuditService;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;

import com.example.demo.iam.role.service.RolePermissionService;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.repository.RoleRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RolePermissionServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private AuditService auditService;

    @InjectMocks
    private RolePermissionService rolePermissionService;

    private Role role;

    private Permission userRead;
    private Permission userDelete;
    private Permission roleAssign;
    private Permission menuRead;

    @BeforeEach
    void setUp() {
        role = Role.create("ADMIN", "System Administrator");

        userRead = new Permission(
                "USER_READ",
                "사용자 조회"
        );

        userDelete = new Permission(
                "USER_DELETE",
                "사용자 삭제"
        );

        roleAssign = new Permission(
                "ROLE_ASSIGN",
                "Role에 Permission 할당"
        );

        menuRead = new Permission(
                "MENU_READ",
                "메뉴 조회"
        );
    }

    @Test
    @DisplayName("Role에 Permission을 할당한다")
    void assignPermissions() {

        when(roleRepository.findWithPermissionsById(1L))
                .thenReturn(Optional.of(role));

        when(permissionRepository.findAllById(Set.of(1L, 2L)))
                .thenReturn(List.of(
                        userRead,
                        userDelete
                ));

        rolePermissionService.assignPermissions(
                100L,
                1L,
                List.of(1L, 2L)
        );

        assertThat(role.getPermissions())
                .containsExactlyInAnyOrder(
                        userRead,
                        userDelete
                );

        verify(roleRepository)
                .findWithPermissionsById(1L);

        verify(permissionRepository)
                .findAllById(Set.of(1L, 2L));

        verify(auditService)
                .log(
                        eq(100L),
                        any(),
                        eq("ROLE"),
                        eq(1L),
                        anyString(),
                        anyString()
                );
    }

    @Test
    @DisplayName("중복된 Permission ID는 하나로 처리한다")
    void duplicatePermissionIdsAreRemoved() {

        when(roleRepository.findWithPermissionsById(1L))
                .thenReturn(Optional.of(role));

        when(permissionRepository.findAllById(Set.of(1L, 2L)))
                .thenReturn(List.of(
                        userRead,
                        userDelete
                ));

        rolePermissionService.assignPermissions(
                100L,
                1L,
                List.of(
                        1L,
                        2L,
                        2L,
                        1L
                )
        );

        verify(permissionRepository)
                .findAllById(Set.of(1L, 2L));

        assertThat(role.getPermissions())
                .containsExactlyInAnyOrder(
                        userRead,
                        userDelete
                );
    }

    @Test
    @DisplayName("존재하지 않는 Permission ID가 포함되면 실패한다")
    void missingPermissionCausesFailure() {

        when(roleRepository.findWithPermissionsById(1L))
                .thenReturn(Optional.of(role));

        when(permissionRepository.findAllById(Set.of(1L, 999L)))
                .thenReturn(List.of(userRead));

        assertThatThrownBy(() ->
                rolePermissionService.assignPermissions(
                        100L,
                        1L,
                        List.of(1L, 999L)
                )
        )
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Some permissions not found");

        verify(auditService, never())
                .log(
                        anyLong(),
                        any(),
                        anyString(),
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }

    @Test
    @DisplayName("존재하지 않는 Role이면 실패한다")
    void missingRoleCausesFailure() {

        when(roleRepository.findWithPermissionsById(999L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() ->
                rolePermissionService.assignPermissions(
                        100L,
                        999L,
                        List.of(1L)
                )
        )
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Role not found");

        verify(permissionRepository, never())
                .findAllById(any());

        verify(auditService, never())
                .log(
                        anyLong(),
                        any(),
                        anyString(),
                        anyLong(),
                        anyString(),
                        anyString()
                );
    }

    @Test
    @DisplayName("기존 Permission을 요청한 Permission 집합으로 전체 교체한다")
    void permissionsAreReplaced() {

        role.setPermissions(Set.of(
                userRead,
                userDelete
        ));

        when(roleRepository.findWithPermissionsById(1L))
                .thenReturn(Optional.of(role));

        when(permissionRepository.findAllById(Set.of(3L, 4L)))
                .thenReturn(List.of(
                        roleAssign,
                        menuRead
                ));

        rolePermissionService.assignPermissions(
                100L,
                1L,
                List.of(3L, 4L)
        );

        assertThat(role.getPermissions())
                .containsExactlyInAnyOrder(
                        roleAssign,
                        menuRead
                )
                .doesNotContain(
                        userRead,
                        userDelete
                );
    }

    @Test
    @DisplayName("빈 Permission 목록이면 기존 Permission을 모두 제거한다")
    void emptyPermissionListRemovesAllPermissions() {

        role.setPermissions(Set.of(
                userRead,
                userDelete,
                roleAssign
        ));

        when(roleRepository.findWithPermissionsById(1L))
                .thenReturn(Optional.of(role));

        when(permissionRepository.findAllById(Set.of()))
                .thenReturn(List.of());

        rolePermissionService.assignPermissions(
                100L,
                1L,
                List.of()
        );

        assertThat(role.getPermissions())
                .isEmpty();

        verify(permissionRepository)
                .findAllById(Set.of());

        verify(auditService)
                .log(
                        eq(100L),
                        any(),
                        eq("ROLE"),
                        eq(1L),
                        anyString(),
                        eq("[]")
                );
    }
}
