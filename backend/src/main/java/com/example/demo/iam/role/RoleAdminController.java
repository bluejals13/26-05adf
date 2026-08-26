package com.example.demo.iam.role;

import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.dto.RoleResponse;
import com.example.demo.iam.role.dto.RolePermissionRequest;
import com.example.demo.iam.role.service.RoleAdminService;
import com.example.demo.iam.role.service.RolePermissionService;

import com.example.demo.auth.security.CustomUserPrincipal;

import com.example.demo.common.dto.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
public class RoleAdminController {

    private final RoleAdminService roleAdminService;
    private final RolePermissionService rolePermissionService;
    
    private Long getAdminId() {        // 400 에러 뜨던 거 로그인 Principal 과 충돌 수정
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();
        
         CustomUserPrincipal principal = (CustomUserPrincipal) auth.getPrincipal();
        
        return principal.getUserId(); // (전제: name = userId)
    }
    
    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getRoles() {

        List<RoleResponse> roles = roleAdminService.getRoles();
        return ResponseEntity.ok( ApiResponse.success("역할이 성공적으로 조회되었습니다.") );
    }

    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> createRole(@Valid @RequestBody RoleRequest request) {

        RoleResponse response =
                roleAdminService.createRole(
                        getAdminId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("역할이 성공적으로 생성되었습니다."));
    }

    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<RoleResponse>> updateRole(@PathVariable Long id,
                          @Valid @RequestBody RoleRequest request) {

        RoleResponse response =
                roleAdminService.updateRole(
                        getAdminId(),
                        id,
                        request
                );

        return ResponseEntity.ok(ApiResponse.success("역할이 성공적으로 수정되었습니다.")));
    }

    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRole(@PathVariable Long id) {

        roleAdminService.deleteRole(
                getAdminId(),
                id
        );

        return ResponseEntity.ok(ApiResponse.success("역할이 성공적으로 삭제되었습니다."));
    }

    @PreAuthorize("hasAuthority('ROLE_ASSIGN')")
    @PostMapping("/{roleId}/permissions")
    public ResponseEntity<ApiResponse<Void>> assignPermissions(@PathVariable Long roleId,
                                   @Valid @RequestBody RolePermissionRequest request) {
        rolePermissionService.assignPermissions(getAdminId(), roleId, request.permissionIds());
        return ResponseEntity.ok(ApiResponse.success("권한이 성공적으로 부여되었습니다."));
    }
}
