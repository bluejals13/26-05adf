package com.example.demo.monitoring;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class BodyLoggingFilter extends OncePerRequestFilter {

    private final LogStore logStore;

    public BodyLoggingFilter(LogStore logStore) {
        this.logStore = logStore;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();

        // 🚫 제외 대상
        if (isExcluded(uri)) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper wrapped =
                new ContentCachingRequestWrapper(request);

        filterChain.doFilter(wrapped, response);

        String body = new String(
                wrapped.getContentAsByteArray(),
                StandardCharsets.UTF_8
        );

        logStore.add(new RequestLog(
                request.getMethod(),
                uri,
                body
        ));
    }

    // 🔥 제외 로직
    private boolean isExcluded(String uri) {
        return uri.startsWith("/monitor")
                || uri.startsWith("/favicon")
                || uri.endsWith(".html");
    }
}