package com.example.demo.iam.menu.repository;

import com.example.demo.iam.menu.domain.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuRepository extends JpaRepository<Menu, Long> {
}