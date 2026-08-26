package com.example.demo.iam.role;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

import com.example.demo.audit.service.AuditService;
import com.example.demo.iam.role.service.RoleAdminService;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.repository.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class RoleAdminServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private ObjectMapper mapper;

    @InjectMocks
    private RoleAdminService roleAdminService;

    @Test
    void Role을_생성한다() {
        RoleRequest request = new RoleRequest("TEST_ROLE", "테스트 권한");

        roleAdminService.createRole(1L, request);

        verify(roleRepository).save(
                argThat(role ->
                        role.getName().equals("TEST_ROLE")
                                && role.getDescription().equals("테스트 권한")
                )
        );
    }

    @Test
    void Role을_수정한다() {
        Role role = Role.create(
                "MANAGER",
                "기존 설명"
        );

        when(roleRepository.findById(1L))
                .thenReturn(Optional.of(role));

        RoleRequest request = new RoleRequest("ADMIN_MANAGER", "수정된 설명");

        roleAdminService.updateRole(1L, 1L, request);

        assertThat(role.getName())
                .isEqualTo("ADMIN_MANAGER");

        assertThat(role.getDescription())
                .isEqualTo("수정된 설명");

        verify(roleRepository).findById(1L);
    }

    @Test
    void 존재하지_않는_Role_수정은_실패한다() {
        when(roleRepository.findById(999L))
                .thenReturn(Optional.empty());

        RoleRequest request = new RoleRequest("MANAGER", "설명");

        assertThrows(
                IllegalArgumentException.class,
                () -> roleAdminService.updateRole(1L, 999L, request)
        );

        verify(roleRepository).findById(999L);
    }

    @Test
    void Role을_삭제한다() {
        Role role = Role.create(
                "MANAGER",
                "관리자 역할"
        );

        when(roleRepository.findById(1L))
                .thenReturn(Optional.of(role));

        roleAdminService.deleteRole(1L, 1L);

        verify(roleRepository).findById(1L);
        verify(roleRepository).delete(role);
    }
}
