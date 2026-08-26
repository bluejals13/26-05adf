package com.example.demo.iam.user.domain;

import com.example.demo.iam.user.domain.UserStatus;

import com.example.demo.iam.role.domain.Role;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String email;

    private String password;

    private LocalDateTime passwordChangedAt; // 비번 변경 시간

    @Enumerated(EnumType.STRING)    // 유저 상태 어드민 관리 페이지 사용
    @Column(nullable = false)
    private UserStatus status;

    // 기본 생성자 (핵심 수정)
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.passwordChangedAt = null;
        this.status = UserStatus.ACTIVE;
    }

    // 팩토리 메서드
    public static User create(String username, String encodedPassword, String email) {
        return new User(username, encodedPassword, email);
    }

    public void updatePassword(String encodedPassword) {
        this.password = encodedPassword;
        this.passwordChangedAt = LocalDateTime.now();
    }

    public LocalDateTime getPasswordChangedAt() {
        return passwordChangedAt;
    }
    
    public void changeStatus(UserStatus status) {
        if (status == null) {
            throw new IllegalArgumentException("status cannot be null");
        }
    this.status = status;
    }
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name="user_id"),
        inverseJoinColumns = @JoinColumn(name="role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public void setRoles(Set<Role> roles) {
    this.roles.clear();
    this.roles.addAll(roles);
    }

}
