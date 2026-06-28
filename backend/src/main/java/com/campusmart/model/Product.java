package com.campusmart.model;

import java.util.ArrayList;
import java.util.List;

public class Product {
    private Long id;
    private String title;
    private String category;
    private Double price;
    private String condition;
    private String location;
    private String description;
    private List<String> images = new ArrayList<>();
    private Long sellerId;
    private String sellerName;
    private String status;
    private Integer viewCount;
    private Integer favoriteCount;
    private String rejectReason;
    private String createdAt;
    private String contact;
    private Boolean favorited;

    public Product() {
    }

    public Product(Long id, String title, String category, Double price, String condition, String location, String description, List<String> images, Long sellerId, String sellerName, String status, Integer viewCount, Integer favoriteCount, String createdAt, String contact) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.price = price;
        this.condition = condition;
        this.location = location;
        this.description = description;
        this.images = images;
        this.sellerId = sellerId;
        this.sellerName = sellerName;
        this.status = status;
        this.viewCount = viewCount;
        this.favoriteCount = favoriteCount;
        this.createdAt = createdAt;
        this.contact = contact;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getViewCount() { return viewCount; }
    public void setViewCount(Integer viewCount) { this.viewCount = viewCount; }
    public Integer getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(Integer favoriteCount) { this.favoriteCount = favoriteCount; }
    public String getRejectReason() { return rejectReason; }
    public void setRejectReason(String rejectReason) { this.rejectReason = rejectReason; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
    public Boolean getFavorited() { return favorited; }
    public void setFavorited(Boolean favorited) { this.favorited = favorited; }
}
