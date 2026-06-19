package com.example.demo.iam.admin.service;
//--
import com.example.demo.audit.domain.AuditAction;
import com.example.demo.audit.service.AuditService;
//--
import com.example.demo.iam.admin.dto.AdminUserResponse;

import com.example.demo.iam.user.repository.UserRepository;

import com.example.demo.iam.user.domain.UserStatus;
import com.example.demo.iam.user.domain.User;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository userRepository;
    private final AuditService auditService;
    private LocalDateTime createdAt;
    
    public List<AdminUserResponse> getUsers() {
        return userRepository.findAll().stream()
            .map(user -> new AdminUserResponse(
                user.getId(),
                user.getUsername(),
                user.getStatus(),
                user.getPasswordChangedAt()
            ))
            .toList();
        }
    
    
    @Transactional
    public void deleteUser(Long adminId, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        //userRepository.delete(user);
        user.changeStatus(UserStatus.DELETE_PENDING);

        auditService.log(
                adminId,
                AuditAction.USER_STATUS_CHANGE,
                userId
        );
    }
    
    //public void restoreUser(Long adminId, Long userId)
    //public void hardDeleteUser(Long adminId, Long userId)
    
    @Transactional
    public void changeStatus(Long adminId, Long userId, UserStatus status) {

        User user = userRepository.findById(userId)
            .orElseThrow();

        user.changeStatus(status);

        auditService.log(
            adminId,
            AuditAction.USER_STATUS_CHANGE,
            userId
        );
    }
}
