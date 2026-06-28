package com.campusmart.controller;

import com.campusmart.common.ApiResponse;
import com.campusmart.common.AuthSupport;
import com.campusmart.model.User;
import com.campusmart.store.CampusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CampusService service;
    private final AuthSupport auth;

    public AuthController(CampusService service, AuthSupport auth) {
        this.service = service;
        this.auth = auth;
    }

    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        User user = service.login(payload.getOrDefault("username", ""), payload.getOrDefault("password", ""));
        return ApiResponse.ok(Map.of("token", auth.token(user.getId()), "user", user));
    }

    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody Map<String, String> payload) {
        return ApiResponse.ok(service.register(payload));
    }

    @GetMapping("/me")
    public ApiResponse<User> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ApiResponse.ok(service.findUser(auth.currentUserId(authorization)));
    }
}
