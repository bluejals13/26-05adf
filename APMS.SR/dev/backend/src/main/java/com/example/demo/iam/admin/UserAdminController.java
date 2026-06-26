package com.example.demo.iam.admin;

import com.example.demo.iam.admin.service.UserAdminService;
import com.example.demo.iam.admin.service.UserRoleService;
import com.example.demo.iam.admin.dto.UserRoleRequest;
import com.example.demo.iam.admin.dto.UserStatusRequest;
import com.example.demo.iam.admin.dto.AdminUserResponse;

import com.example.demo.config.SecurityUtil;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserAdminService userAdminService;
    private final UserRoleService userRoleService;
    private final SecurityUtil securityUtil;

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public List<AdminUserResponse> getUsers() {
        return userAdminService.getUsers();
    }
    
    @PreAuthorize("hasAuthority('USER_DELETE')")
    @DeleteMapping("/{id}/soft")
    public void softdeleteUser(@PathVariable Long id) {    // 계정 삭제 대기 권한

        Long adminId = securityUtil.getUserId();

        userAdminService.softdeleteUser(adminId, id);
    }
    
    @PreAuthorize("hasAuthority('USER_DELETE')")
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {// 계정 영구 삭제 권한

        Long adminId = securityUtil.getUserId();

        userAdminService.deleteUser(adminId, id);
    }
    
    @PreAuthorize("hasAuthority('USER_STATUS_UPDATE')")
    @PatchMapping("/{id}/status")
    public void changeStatus(
            @PathVariable Long id,
            @RequestBody UserStatusRequest request
    ) {
        Long adminId = securityUtil.getUserId();

        userAdminService.changeStatus(adminId, id, request.status());
    }
    
    @PreAuthorize("hasAuthority('USER_ROLE_MANAGE')")
    @PostMapping("/{id}/roles")
    public void assignRoles(
            @PathVariable Long id,
            @RequestBody UserRoleRequest request
    ) {
        Long adminId = securityUtil.getUserId();

        userRoleService.assignRoles(adminId, id, request.roleIds());
    }
}
