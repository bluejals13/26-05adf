package com.example.demo.iam.role;

import com.example.demo.iam.role.dto.RoleRequest;
import com.example.demo.iam.role.dto.RoleResponse;
import com.example.demo.iam.role.dto.RolePermissionRequest;
import com.example.demo.iam.role.service.RoleAdminService;
import com.example.demo.iam.role.service.RolePermissionService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/roles")
@RequiredArgsConstructor
public class RoleAdminController {

    private final RoleAdminService roleAdminService;
    private final RolePermissionService rolePermissionService;

    @PreAuthorize("hasAuthority('ROLE_READ')")
    @GetMapping
    public List<RoleResponse> getRoles() {
        return roleAdminService.getRoles();
    }

    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    @PostMapping
    public void createRole(@RequestBody RoleRequest request) {
        roleAdminService.createRole(request);
    }

    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    @PatchMapping("/{id}")
    public void updateRole(@PathVariable Long id,
                           @RequestBody RoleRequest request) {
        roleAdminService.updateRole(id, request);
    }

    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable Long id) {
        roleAdminService.deleteRole(id);
    }

    @PreAuthorize("hasAuthority('ROLE_PERMISSION_MANAGE')")
    @PostMapping("/{roleId}/permissions")
    public void assignPermissions(@PathVariable Long roleId,
                                   @RequestBody RolePermissionRequest request) {
        rolePermissionService.assignPermissions(roleId, request.permissionIds());
    }
}
