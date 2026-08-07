package com.example.demo.auth.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import org.springframework.security.test.context.support.WithMockUser;


import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;


    @Test
    @DisplayName(
            "인증되지 않은 사용자는 보호 API에 접근할 수 없고 401을 반환한다"
    )
    void unauthenticatedUserCannotAccessProtectedApi()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/users/me"
                        )
                )
                .andExpect(
                        status().isUnauthorized()
                )
                .andExpect(
                        jsonPath(
                                "$.code"
                        ).value(
                                "UNAUTHORIZED"
                        )
                );
    }


    @Test
    @WithMockUser(
            username = "testuser"
    )
    @DisplayName(
            "인증된 사용자는 보호 API에 접근할 수 있다"
    )
    void authenticatedUserCanAccessProtectedApi()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/users/me"
                        )
                )
                .andExpect(
                        status().isOk()
                );
    }


    @Test
    @WithMockUser(
            username = "testuser"
    )
    @DisplayName(
            "현재 SecurityConfig에서는 인증된 사용자가 관리자 경로를 통과한다"
    )
    void authenticatedUserCanAccessAdminPath()
            throws Exception {

        mockMvc.perform(
                        get(
                                "/api/admin/users"
                        )
                )
                .andExpect(
                        status().isOk()
                );
    }
}
