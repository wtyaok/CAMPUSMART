package com.campusmart.common;

import org.springframework.stereotype.Component;

@Component
public class AuthSupport {
    public Long currentUserId(String authorization) {
        if (authorization == null || authorization.isBlank()) {
            throw new BusinessException("请先登录");
        }
        String token = authorization.replace("Bearer ", "");
        String[] parts = token.split("-");
        if (parts.length >= 3) {
            return Long.valueOf(parts[2]);
        }
        if (parts.length >= 1) {
            return Long.valueOf(parts[0]);
        }
        throw new BusinessException("登录状态无效");
    }

    public String token(Long userId) {
        return "campus-token-" + userId + "-" + System.currentTimeMillis();
    }
}
