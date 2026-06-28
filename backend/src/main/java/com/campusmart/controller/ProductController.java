package com.campusmart.controller;

import com.campusmart.common.ApiResponse;
import com.campusmart.common.AuthSupport;
import com.campusmart.common.PageResult;
import com.campusmart.model.Product;
import com.campusmart.store.CampusService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {
    private final CampusService service;
    private final AuthSupport auth;

    public ProductController(CampusService service, AuthSupport auth) {
        this.service = service;
        this.auth = auth;
    }

    @GetMapping("/products")
    public ApiResponse<PageResult<Product>> products(
            @RequestParam Map<String, String> query,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Long userId = optionalUserId(authorization);
        return ApiResponse.ok(service.listProducts(query, userId, false));
    }

    @GetMapping("/products/{id}")
    public ApiResponse<Product> detail(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.productDetail(id, optionalUserId(authorization)));
    }

    @PostMapping("/products")
    public ApiResponse<Product> create(
            @RequestBody Product payload,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.createProduct(payload, auth.currentUserId(authorization)));
    }

    @PutMapping("/products/{id}")
    public ApiResponse<Product> update(
            @PathVariable Long id,
            @RequestBody Product payload,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.updateProduct(id, payload, auth.currentUserId(authorization)));
    }

    @DeleteMapping("/products/{id}")
    public ApiResponse<Boolean> delete(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        service.deleteProduct(id, auth.currentUserId(authorization));
        return ApiResponse.ok(true);
    }

    @PostMapping("/products/{id}/favorite")
    public ApiResponse<Product> favorite(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.favorite(id, auth.currentUserId(authorization)));
    }

    @DeleteMapping("/products/{id}/favorite")
    public ApiResponse<Product> unfavorite(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.unfavorite(id, auth.currentUserId(authorization)));
    }

    @GetMapping("/products/my")
    public ApiResponse<List<Product>> myProducts(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ApiResponse.ok(service.myProducts(auth.currentUserId(authorization)));
    }

    @PutMapping("/products/{id}/off-shelf")
    public ApiResponse<Product> offShelf(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        return ApiResponse.ok(service.offShelfMyProduct(id, auth.currentUserId(authorization)));
    }

    @GetMapping("/favorites")
    public ApiResponse<List<Product>> favorites(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ApiResponse.ok(service.favorites(auth.currentUserId(authorization)));
    }

    private Long optionalUserId(String authorization) {
        if (authorization == null || authorization.isBlank()) return null;
        return auth.currentUserId(authorization);
    }
}
