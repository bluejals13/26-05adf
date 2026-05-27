package com.example.demo.user.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.AccessLevel;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true)
	private String username;

	private String password;

	public User(String username, String password) {
		this.username = username;
		this.password = password;
	}

	public static User create(String username, String encodedPassword) {
		return new User(username, encodedPassword);
	}

	public void updatePassword(String encodedPassword) {
		this.password = encodedPassword;
	}
}
