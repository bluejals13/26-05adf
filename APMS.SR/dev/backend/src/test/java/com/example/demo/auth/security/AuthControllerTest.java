package com.example.demo.auth.security;

//import com.example.demo.auth.jwt.JwtProvider;

import com.example.demo.iam.user.dto.LoginRequest;
import com.example.demo.iam.user.dto.LoginResult;

//import com.example.demo.iam.user.repository.UserRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;

import org.springframework.data.redis.core.RedisTemplate;

import org.springframework.http.MediaType;

import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.BDDMockito.given;

import static org.mockito.Mockito.verify;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(controllers = AuthController.class,
           excludeFilters = {
                      @ComponentScan.Filter(
                                 type = FilterType.ASSIGABLE_TYPE,
                                 classes = SecurityConfig.class
                      )
           }
)
//@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    //@MockBean
    //private JwtAuthenticationFilter jwtAuthenticationFilter;

    
    
    //@MockBean
    //private JwtProvider jwtProvider;
    
    //@MockBean
    //private RedisTemplate<String, String> redisTemplate;
    
    //@MockBean
    //private UserRepository userRepository;

    
    @Test
    @DisplayName(
            "로그인 성공 시 Access Token 반환 및 Refresh Token Cookie 저장"
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
        )
        .willReturn(
                result
        );


        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(
                                MediaType.APPLICATION_JSON
                        )
                        .content(
                                objectMapper.writeValueAsString(request)
                        )
        )
        .andExpect(
                status().isOk()
        )
        .andExpect(
                jsonPath("$.accessToken")
                .value("access-token")
        )
        .andExpect(
                jsonPath("$.grantType")
                .value("Bearer")
        )
        .andExpect(
                jsonPath("$.refreshToken")
                .doesNotExist()
        )
        .andExpect(
                cookie().value(
                        "refreshToken",
                        "refresh-token"
                )
        )
        .andExpect(
                cookie().httpOnly(
                        "refreshToken",
                        true
                )
        )
        .andExpect(
                cookie().secure(
                        "refreshToken",
                        true
                )
        );


        verify(
                authService
        )
        .login(
                eq(request)
        );
    }



    @Test
    @DisplayName(
            "Refresh Token Rotation 후 새 Access Token 반환 및 Refresh Cookie 갱신"
    )
    void refreshSuccess()
            throws Exception {


        LoginResult result =
                new LoginResult(
                        "new-access-token",
                        "Bearer",
                        "new-refresh-token"
                );


        given(
                authService.refresh(
                        "old-refresh-token"
                )
        )
        .willReturn(
                result
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
                jsonPath("$.accessToken")
                .value("new-access-token")
        )
        .andExpect(
                jsonPath("$.grantType")
                .value("Bearer")
        )
        .andExpect(
                jsonPath("$.refreshToken")
                .doesNotExist()
        )
        .andExpect(
                cookie().value(
                        "refreshToken",
                        "new-refresh-token"
                )
        )
        .andExpect(
                cookie().httpOnly(
                        "refreshToken",
                        true
                )
        )
        .andExpect(
                cookie().secure(
                        "refreshToken",
                        true
                )
        );


        verify(
                authService
        )
        .refresh(
                "old-refresh-token"
        );
    }



    @Test
    @DisplayName(
            "로그아웃 시 Access Token 전달 후 Refresh Cookie 삭제"
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
        )
        .andExpect(
                cookie().secure(
                        "refreshToken",
                        true
                )
        );


        verify(
                authService
        )
        .logout(
                "access-token"
        );
    }



    @Test
    @DisplayName(
            "Access Token이 없으면 로그아웃 실패"
    )
    void logoutWithoutAccessTokenFail()
            throws Exception {


        mockMvc.perform(
                post("/api/auth/logout")
        )
        .andExpect(
                status().isUnauthorized()
        );
    }
}
