package com.example.demo.iam.menu;

import com.example.demo.iam.menu.dto.MenuRequest;
import com.example.demo.iam.menu.dto.MenuResponse;
import com.example.demo.iam.menu.service.MenuAdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menus")
@RequiredArgsConstructor
public class MenuAdminController {

    private final MenuAdminService menuAdminService;

    @PreAuthorize("hasAuthority('MENU_READ')")
    @GetMapping
    public List<MenuResponse> getMenus() {
        return menuAdminService.getMenus();
    }

    @PreAuthorize("hasAuthority('MENU_CREATE')")
    @PostMapping
    public void createMenu(@RequestBody MenuRequest request) {
        menuAdminService.createMenu(request);
    }

    @PreAuthorize("hasAuthority('MENU_UPDATE')")
    @GetMapping("/{id}")
    public MenuResponse getMenu(
        @PathVariable Long id
    ) {
        return menuAdminService.getMenu(id);
    }

    @PreAuthorize("hasAuthority('MENU_DELETE')")
    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuAdminService.deleteMenu(id);
    }
}
