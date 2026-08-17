package com.example.demo.iam.permission;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

import com.example.demo.iam.permission.domain.Permission;
import com.example.demo.iam.permission.repository.PermissionRepository;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleDto;
import com.example.demo.iam.role.repository.RoleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class PermissionAdminServiceTest {

    @Mock
    private PermissionRepository permissionRepository;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private PermissionAdminService permissionAdminService;

    @Test
    void Permission_목록을_조회한다() {

        Permission p1 =
                Permission.create(
                        "USER_READ",
                        "사용자 조회"
                );

        Permission p2 =
                Permission.create(
                        "ROLE_READ",
                        "Role 조회"
                );

        when(permissionRepository.findAll())
                .thenReturn(List.of(p1, p2));

        var result =
                permissionAdminService.getPermissions();

        assertThat(result).hasSize(2);
        assertThat(result)
                .extracting("name")
                .containsExactly(
                        "USER_READ",
                        "ROLE_READ"
                );

        verify(permissionRepository).findAll();
    }

    @Test
    void Permission_상세조회시_Role을_조회한다() {

        Permission permission =
                Permission.create(
                        "ROLE_ASSIGN",
                        "Role에 Permission 할당"
                );

        Role role =
                Role.create(
                        "ADMIN",
                        "관리자"
                );

        when(permissionRepository.findById(1L))
                .thenReturn(Optional.of(permission));

        when(roleRepository.findByPermissionId(1L))
                .thenReturn(List.of(role));

        var result =
                permissionAdminService.getPermissionDetail(1L);

        assertThat(result).isNotNull();
        assertThat(result.roles())
                .extracting(RoleDto::name)
                .contains("ADMIN");

        verify(permissionRepository).findById(1L);
        verify(roleRepository).findByPermissionId(1L);
    }

    @Test
    void Permission_상세조회에서는_UserRepository를_사용하지_않는다() {

        Permission permission =
                Permission.create(
                        "USER_READ",
                        "사용자 조회"
                );

        when(permissionRepository.findById(1L))
                .thenReturn(Optional.of(permission));

        when(roleRepository.findByPermissionId(1L))
                .thenReturn(List.of());

        permissionAdminService.getPermissionDetail(1L);

        verify(permissionRepository).findById(1L);
        verify(roleRepository).findByPermissionId(1L);
    }
}
