package com.example.demo.monitoring;

import jakarta.annotation.Nonnull;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

	private final LogStore logStore;

	public RequestLoggingFilter(LogStore logStore) {
		this.logStore = logStore;
	}

	@Override
	protected void doFilterInternal(
            HttpServletRequest request,
            @Nonnull HttpServletResponse response,
            @Nonnull FilterChain filterChain
	) throws ServletException, IOException {

		String uri = request.getRequestURI();

		// 🚫 반드시 추가
		if (uri.startsWith("/monitor")
				|| uri.startsWith("/favicon")
				|| uri.endsWith(".html")) {
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
}