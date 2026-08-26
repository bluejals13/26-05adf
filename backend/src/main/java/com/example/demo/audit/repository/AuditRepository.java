package com.example.demo.audit.repository;

import com.example.demo.audit.domain.Audit;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface AuditRepository extends JpaRepository<Audit, Long>, JpaSpecificationExecutor<Audit> {

    List<Audit> findByUserId(Long userId);

    List<Audit> findByAction(String action);

    List<Audit> findByUserIdAndAction(Long userId, String action);

    Page<Audit> findAll(Pageable pageable);
    
}                                                                     
