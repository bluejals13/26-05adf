package com.example.demo.iam.menu.service;

import com.example.demo.iam.menu.dto.MenuRequest;
import com.example.demo.iam.menu.dto.MenuResponse;
import com.example.demo.iam.menu.domain.Menu;
import com.example.demo.iam.menu.repository.MenuRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MenuAdminService {

    private final MenuRepository menuRepository;
    
    public MenuResponse getMenu(Long id) {
        Menu menu = menuRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("메뉴를 찾을 수 없습니다."));
    
        return new MenuResponse(
            menu.getId(),
            menu.getName(),
            menu.getPrice()
        );
    }

    @Transactional(readOnly = true)
    public List<MenuResponse> getMenus() {
        return menuRepository.findAll()
                .stream()
                .map(menu -> new MenuResponse(
                        menu.getId(),
                        menu.getName(),
                        menu.getPrice()
                ))
                .toList();
    }

    public void createMenu(MenuRequest request) {
        Menu menu = new Menu(
                request.name(),
                request.price()
        );

        menuRepository.save(menu);
    }

    public void updateMenu(Long id, MenuRequest request) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("메뉴를 찾을 수 없습니다."));

        menu.update(
                request.name(),
                request.price()
        );
    }

    public void deleteMenu(Long id) {
        menuRepository.deleteById(id);
    }
}
