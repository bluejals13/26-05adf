package com.example.demo.iam.permission;

import com.example.demo.iam.permission.dto.PermissionDetailResponse;
import com.example.demo.iam.permission.dto.PermissionResponse;
import com.example.demo.iam.permission.service.PermissionAdminService;

import com.example.demo.common.dto.ApiResponse;

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
    public ApiResponse<List<PermissionResponse>> getPermissions() {
        return ApiResponse.success(permissionAdminService.getPermissions());
    }

    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    @GetMapping("/{id}")
    public ApiResponse<PermissionDetailResponse> getPermission(@PathVariable Long id) {
        return ApiResponse.success(permissionAdminService.getPermissionDetail(id));
    }
}
