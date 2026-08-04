package com.example.demo.auth.security;

import com.example.demo.auth.jwt.JwtProvider;
import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;
import com.example.demo.iam.user.dto.TokenResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtProvider jwtProvider;


    @Test
    @DisplayName(
            "정상적인 로그인 요청이면 Access Token과 Refresh Token Cookie를 반환한다"
    )
    void loginSuccess()
            throws Exception {

        LoginRequest request =
                new LoginRequest(
                        "testuser",
                        "password123!"
                );

        LoginResult result =
                new LoginResult(
                        "access-token",
                        "Bearer",
                        "refresh-token"
                );

        given(
                authService.login(
                        any(LoginRequest.class)
                )
        ).willReturn(
                result
        );

        mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(
                                        MediaType.APPLICATION_JSON
                                )
                                .content(
                                        objectMapper
                                                .writeValueAsString(
                                                        request
                                                )
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.accessToken"
                        ).value(
                                "access-token"
                        )
                )
                .andExpect(
                        jsonPath(
                                "$.grantType"
                        ).value(
                                "Bearer"
                        )
                )
                .andExpect(
                        cookie().exists(
                                "refreshToken"
                        )
                )
                .andExpect(
                        cookie().httpOnly(
                                "refreshToken",
                                true
                        )
                );

        verify(
                authService
        ).login(
                eq(request)
        );
    }


    @Test
    @DisplayName(
            "Refresh Token Cookie가 있으면 새 Access Token과 Refresh Token을 반환한다"
    )
    void refreshSuccess()
            throws Exception {

        TokenResponse tokenResponse =
                new TokenResponse(
                        "new-access-token",
                        "new-refresh-token"
                );

        given(
                authService.refresh(
                        "old-refresh-token"
                )
        ).willReturn(
                tokenResponse
        );

        mockMvc.perform(
                        post("/api/auth/refresh")
                                .cookie(
                                        new Cookie(
                                                "refreshToken",
                                                "old-refresh-token"
                                        )
                                )
                )
                .andExpect(
                        status().isOk()
                )
                .andExpect(
                        jsonPath(
                                "$.accessToken"
                        ).value(
                                "new-access-token"
                        )
                )
                .andExpect(
                        cookie().exists(
                                "refreshToken"
                        )
                )
                .andExpect(
                        cookie().httpOnly(
                                "refreshToken",
                                true
                        )
                );

        verify(
                authService
        ).refresh(
                "old-refresh-token"
        );
    }


    @Test
    @DisplayName(
            "로그아웃하면 Access Token을 서비스에 전달하고 Refresh Token Cookie를 삭제한다"
    )
    void logoutSuccess()
            throws Exception {

        mockMvc.perform(
                        post("/api/auth/logout")
                                .header(
                                        "Authorization",
                                        "Bearer access-token"
                                )
                                .cookie(
                                        new Cookie(
                                                "refreshToken",
                                                "refresh-token"
                                        )
                                )
                )
                .andExpect(
                        status().isNoContent()
                )
                .andExpect(
                        cookie().maxAge(
                                "refreshToken",
                                0
                        )
                )
                .andExpect(
                        cookie().httpOnly(
                                "refreshToken",
                                true
                        )
                );

        verify(
                authService
        ).logout(
                "access-token"
        );
    }
}