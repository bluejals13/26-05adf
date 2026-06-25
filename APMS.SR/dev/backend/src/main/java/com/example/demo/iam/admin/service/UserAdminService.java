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
    
    private void validateTransition(
        UserStatus current,
        UserStatus target
    ) {
        if (current == UserStatus.DELETED) {
            throw new IllegalStateException("삭제된 사용자는 상태 변경 불가");
        }
    }
    
    
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
    public void deleteUser(Long adminId, Long userId) {                          // 계정 삭제
        User user = userRepository.findById(userId)
            .orElseThrow();
        
        UserStatus before = user.getStatus();        
        
        user.changeStatus(UserStatus.DELETE_PENDING);
        
        auditService.log(
            adminId,
            AuditAction.USER_DELETE,
            "USER",
            userId,
            before.name(),
            status.DELETE_PENDING.name()
        );
    }
    
    //public void restoreUser(Long adminId, Long userId)
    //public void hardDeleteUser(Long adminId, Long userId)
    
    @Transactional
    public void changeStatus(Long adminId, Long userId, UserStatus status) {    // 계정 상태 변경 [활성] > [정지]

        User user = userRepository.findById(userId)
            .orElseThrow();
        
        UserStatus before = user.getStatus();        
        
        validateTransition(user.getStatus(), status);
        
        user.changeStatus(status);
        
        auditService.log(
            adminId,
            AuditAction.USER_STATUS_CHANGE,
            "USER",
            userId,
            before.name(),
            status.name()
        );
    }
}
