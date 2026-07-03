package com.example.demo.iam.role;

import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.dto.RoleResponse;
import com.example.demo.iam.role.dto.RolePermissionRequest;
import com.example.demo.iam.role.service.RoleAdminService;
import com.example.demo.iam.role.service.RolePermissionService;

import com.example.demo.auth.security.CustomUserPrincipal;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
        
        CustomUserPrincipal user = (CustomUserPrincipal) auth.getPrincipal();
        
        return principal.getUserId(); // (전제: name = userId)
    }
    
    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping
    public List<RoleResponse> getRoles() {
        return roleAdminService.getRoles();
    }

    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    @PostMapping
    public void createRole(@RequestBody RoleRequest request) {
        roleAdminService.createRole(getAdminId(), request);
    }

    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    @PatchMapping("/{id}")
    public void updateRole(@PathVariable Long id,
                           @RequestBody RoleRequest request) {
        roleAdminService.updateRole(getAdminId(), id, request);
    }

    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id) {
        roleAdminService.deleteRole(getAdminId(), id);
    }

    @PreAuthorize("hasAuthority('ROLE_PERMISSION_MANAGE')")
    @PostMapping("/{roleId}/permissions")
    public void assignPermissions(@PathVariable Long roleId,
                                   @RequestBody RolePermissionRequest request) {
        rolePermissionService.assignPermissions(getAdminId(), roleId, request.permissionIds());
    }
}
