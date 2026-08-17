package com.example.demo.iam.role;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.example.demo.iam.role.service.RoleAdminService;
import com.example.demo.iam.role.domain.Role;
import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.repository.RoleRepository;

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

    @InjectMocks
    private RoleAdminService roleAdminService;

    @Test
    void Role을_생성한다() {
        RoleRequest request = new RoleRequest();
        request.setName("TEST_ROLE");
        request.setDescription("테스트 권한");

        roleAdminService.createRole(1L, request);

        verify(roleRepository).save(argThat(role ->
            role.getName().equals("TEST_ROLE")
                    && role.getDescription().equals("Test role")
    ));
    }

    @Test
    void Role을_수정한다() {
        Role role = Role.create(
                "MANAGER",
                "기존 설명"
        );

        when(roleRepository.findById(1L))
                .thenReturn(Optional.of(role));

        RoleRequest request = new RoleRequest();
        request.setName("ADMIN_MANAGER");
        request.setDescription("수정된 설명");

        roleAdminService.updateRole(1L, 1L, request);

        assertThat(role.getName()).isEqualTo("ADMIN_MANAGER");
        assertThat(role.getDescription()).isEqualTo("수정된 설명");

        verify(roleRepository).findById(1L);
    }

    @Test
    void 존재하지_않는_Role_수정은_실패한다() {
        when(roleRepository.findById(999L))
                .thenReturn(Optional.empty());

        RoleRequest request = new RoleRequest();
        request.setName("MANAGER");
        request.setDescription("설명");

        assertThrows(
                RuntimeException.class,
                () -> roleAdminService.updateRole(1L, 999L, request)
        );
    }

    @Test
    void Role을_삭제한다() {
        when(roleRepository.existsById(1L))
                .thenReturn(true);

        roleAdminService.deleteRole(1L, 1L);

        verify(roleRepository).deleteById(1L);
    }
}
