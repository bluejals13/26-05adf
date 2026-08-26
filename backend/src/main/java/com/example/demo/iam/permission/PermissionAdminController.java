package com.example.demo.iam.permission;

import com.example.demo.iam.permission.dto.PermissionDetailResponse;
import com.example.demo.iam.permission.dto.PermissionResponse;
import com.example.demo.iam.permission.service.PermissionAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/permissions")
@RequiredArgsConstructor
public class PermissionAdminController {

    private final PermissionAdminService permissionAdminService;

    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @GetMapping
    public List<PermissionResponse> getPermissions() {
        return permissionAdminService.getPermissions();
    }

    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @GetMapping("/{id}")
    public PermissionDetailResponse getPermission(@PathVariable Long id) {
        return permissionAdminService.getPermissionDetail(id);
    }
}
