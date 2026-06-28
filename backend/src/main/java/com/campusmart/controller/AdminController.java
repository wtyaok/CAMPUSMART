package com.campusmart.controller;

import com.campusmart.common.ApiResponse;
import com.campusmart.common.PageResult;
import com.campusmart.model.Order;
import com.campusmart.model.Product;
import com.campusmart.model.User;
import com.campusmart.store.CampusService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final CampusService service;

    public AdminController(CampusService service) {
        this.service = service;
    }

    @GetMapping("/dashboard")
    public ApiResponse<Map<String, Object>> dashboard() {
        return ApiResponse.ok(service.dashboard());
    }

    @GetMapping("/products/review")
    public ApiResponse<List<Product>> reviewProducts() {
        return ApiResponse.ok(service.reviewProducts());
    }

    @GetMapping("/products")
    public ApiResponse<PageResult<Product>> products(@RequestParam Map<String, String> query) {
        return ApiResponse.ok(service.listProducts(query, null, true));
    }

    @PutMapping("/products/{id}/approve")
    public ApiResponse<Product> approve(@PathVariable Long id) {
        return ApiResponse.ok(service.approveProduct(id));
    }

    @PutMapping("/products/{id}/reject")
    public ApiResponse<Product> reject(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ApiResponse.ok(service.rejectProduct(id, payload.getOrDefault("reason", "未通过审核")));
    }

    @PutMapping("/products/{id}/off-shelf")
    public ApiResponse<Product> offShelf(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ApiResponse.ok(service.adminOffShelf(id, payload.getOrDefault("reason", "违规下架")));
    }

    @GetMapping("/users")
    public ApiResponse<List<Map<String, Object>>> users(@RequestParam(defaultValue = "") String keyword) {
        return ApiResponse.ok(service.adminUsers(keyword));
    }

    @PutMapping("/users/{id}/status")
    public ApiResponse<User> userStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ApiResponse.ok(service.updateUserStatus(id, payload.getOrDefault("status", "normal")));
    }

    @GetMapping("/orders")
    public ApiResponse<PageResult<Order>> orders(@RequestParam Map<String, String> query) {
        return ApiResponse.ok(service.orders(query, null, true));
    }

    @PutMapping("/orders/{id}/handle")
    public ApiResponse<Order> handleOrder(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return ApiResponse.ok(service.handleAbnormal(id, payload.getOrDefault("status", "completed"), payload.getOrDefault("note", "管理员处理")));
    }
}
