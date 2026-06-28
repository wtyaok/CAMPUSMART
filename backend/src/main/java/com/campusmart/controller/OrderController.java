package com.campusmart.controller;

import com.campusmart.common.ApiResponse;
import com.campusmart.common.AuthSupport;
import com.campusmart.common.PageResult;
import com.campusmart.model.Order;
import com.campusmart.store.CampusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CampusService service;
    private final AuthSupport auth;

    public OrderController(CampusService service, AuthSupport auth) {
        this.service = service;
        this.auth = auth;
    }

    @GetMapping
    public ApiResponse<PageResult<Order>> orders(
            @RequestParam Map<String, String> query,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.orders(query, auth.currentUserId(authorization), false));
    }

    @GetMapping("/{id}")
    public ApiResponse<Order> detail(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.orderDetail(id, auth.currentUserId(authorization), false));
    }

    @PostMapping
    public ApiResponse<Order> create(
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.createOrder(payload, auth.currentUserId(authorization)));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Order> status(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.updateOrderStatus(id, payload.get("status"), auth.currentUserId(authorization)));
    }
}
