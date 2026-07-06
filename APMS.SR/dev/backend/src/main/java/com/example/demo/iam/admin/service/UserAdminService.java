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
    public void softdeleteUser(Long adminId, Long userId) {    // 삭제 대기
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalStateException("User not found: " + userId));
        
        UserStatus before = user.getStatus();        
        
        user.changeStatus(UserStatus.DELETE_PENDING);
        
        auditService.log(
            adminId,
            AuditAction.USER_DELETE,
            "USER",
            userId,
            before.name(),
            UserStatus.DELETE_PENDING.name()
        );
    }
    
    @Transactional
    public void deleteUser(Long adminId, Long userId) {    // 영구 삭제
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalStateException("User not found: " + userId));
        
        UserStatus before = user.getStatus(); 
        
        if (before != UserStatus.DELETE_PENDING) { throw new IllegalStateException("삭제 대기 계정이 아닙니다"); }
        
        user.changeStatus(UserStatus.DELETED);
        
        auditService.log(
            adminId,
            AuditAction.USER_DELETE,
            "USER",
            userId,
            before.name(),
            UserStatus.DELETED.name()
        );
        
        userRepository.delete(user);
    }
    //public void restoreUser(Long adminId, Long userId)
    //public void hardDeleteUser(Long adminId, Long userId)
    
    @Transactional
    public void changeStatus(Long adminId, Long userId, UserStatus status) {    // 계정 상태 변경

        User user = userRepository.findById(userId)
            .orElseThrow();
        
        UserStatus before = user.getStatus();        
        
        if (before == status) { return; }
            
        validateTransition(before, status);
        
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
