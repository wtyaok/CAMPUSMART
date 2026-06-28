package com.campusmart.controller;

import com.campusmart.common.ApiResponse;
import com.campusmart.common.AuthSupport;
import com.campusmart.model.Message;
import com.campusmart.store.CampusService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final CampusService service;
    private final AuthSupport auth;

    public MessageController(CampusService service, AuthSupport auth) {
        this.service = service;
        this.auth = auth;
    }

    @GetMapping
    public ApiResponse<List<Message>> list(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ApiResponse.ok(service.messages(auth.currentUserId(authorization)));
    }

    @PutMapping("/{id}/read")
    public ApiResponse<Message> read(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.readMessage(id, auth.currentUserId(authorization)));
    }

    @PutMapping("/read-all")
    public ApiResponse<Boolean> readAll(@RequestHeader(value = "Authorization", required = false) String authorization) {
        service.readAllMessages(auth.currentUserId(authorization));
        return ApiResponse.ok(true);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Boolean> delete(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        service.deleteMessage(id, auth.currentUserId(authorization));
        return ApiResponse.ok(true);
    }
}
