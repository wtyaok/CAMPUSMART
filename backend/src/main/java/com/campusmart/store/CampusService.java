package com.campusmart.store;

import com.campusmart.common.BusinessException;
import com.campusmart.common.PageResult;
import com.campusmart.model.Message;
import com.campusmart.model.Order;
import com.campusmart.model.OrderTimeline;
import com.campusmart.model.Product;
import com.campusmart.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class CampusService {
    private final InMemoryStore store;

    public CampusService(InMemoryStore store) {
        this.store = store;
    }

    public User login(String username, String password) {
        User user = store.users.stream()
                .filter(item -> item.getUsername().equals(username) && item.getPassword().equals(password))
                .findFirst()
                .orElseThrow(() -> new BusinessException("用户名或密码错误"));
        if ("disabled".equals(user.getStatus())) {
            throw new BusinessException("账号已被禁用，请联系管理员");
        }
        return safeUser(user);
    }

    public User register(Map<String, String> payload) {
        String username = payload.getOrDefault("username", "").trim();
        if (username.length() < 3) {
            throw new BusinessException("用户名至少 3 位");
        }
        if (store.users.stream().anyMatch(user -> user.getUsername().equals(username))) {
            throw new BusinessException("用户名已存在");
        }
        User user = new User(
                store.nextUserId(),
                username,
                payload.getOrDefault("password", ""),
                payload.getOrDefault("nickname", username),
                "user",
                payload.get("phone"),
                "https://api.dicebear.com/8.x/initials/svg?seed=" + username,
                "normal",
                store.now()
        );
        store.users.add(user);
        return safeUser(user);
    }

    public User findUser(Long id) {
        return safeUser(userOrThrow(id));
    }

    public PageResult<Product> listProducts(Map<String, String> query, Long userId, boolean admin) {
        String keyword = query.getOrDefault("keyword", "").trim().toLowerCase();
        String category = query.getOrDefault("category", "");
        String status = query.getOrDefault("status", admin ? "" : "on_sale");
        if (!admin && status.isBlank()) {
            status = "on_sale";
        }
        String sort = query.getOrDefault("sort", "latest");
        double minPrice = parseDouble(query.get("minPrice"), -1);
        double maxPrice = parseDouble(query.get("maxPrice"), -1);

        Stream<Product> stream = store.products.stream();
        if (!status.isBlank()) stream = stream.filter(item -> status.equals(item.getStatus()));
        if (!category.isBlank()) stream = stream.filter(item -> category.equals(item.getCategory()));
        if (!keyword.isBlank()) {
            stream = stream.filter(item -> (item.getTitle() + item.getDescription() + item.getSellerName()).toLowerCase().contains(keyword));
        }
        if (minPrice >= 0) stream = stream.filter(item -> item.getPrice() >= minPrice);
        if (maxPrice >= 0) stream = stream.filter(item -> item.getPrice() <= maxPrice);

        Comparator<Product> comparator = Comparator.comparing(Product::getCreatedAt).reversed();
        if ("priceAsc".equals(sort)) comparator = Comparator.comparing(Product::getPrice);
        if ("priceDesc".equals(sort)) comparator = Comparator.comparing(Product::getPrice).reversed();

        List<Product> list = stream.sorted(comparator).map(item -> copyProduct(item, userId)).collect(Collectors.toList());
        return page(list, query);
    }

    public Product productDetail(Long id, Long userId) {
        Product product = productOrThrow(id);
        product.setViewCount(product.getViewCount() + 1);
        return copyProduct(product, userId);
    }

    public Product createProduct(Product payload, Long userId) {
        User seller = userOrThrow(userId);
        if ("disabled".equals(seller.getStatus())) {
            throw new BusinessException("账号已被禁用，不能发布商品");
        }
        Product product = copyProduct(payload, userId);
        product.setId(store.nextProductId());
        product.setSellerId(userId);
        product.setSellerName(seller.getNickname());
        product.setStatus("pending_review");
        product.setViewCount(0);
        product.setFavoriteCount(0);
        product.setCreatedAt(store.now());
        product.setFavorited(false);
        store.products.add(0, product);
        message(userId, "商品提交成功", "你发布的「" + product.getTitle() + "」已进入审核。", "review");
        return product;
    }

    public Product updateProduct(Long id, Product payload, Long userId) {
        Product product = productOrThrow(id);
        if (!Objects.equals(product.getSellerId(), userId)) throw new BusinessException("只能编辑自己发布的商品");
        if (!List.of("pending_review", "on_sale", "rejected").contains(product.getStatus())) throw new BusinessException("当前状态不可编辑");
        product.setTitle(payload.getTitle());
        product.setCategory(payload.getCategory());
        product.setPrice(payload.getPrice());
        product.setCondition(payload.getCondition());
        product.setLocation(payload.getLocation());
        product.setContact(payload.getContact());
        product.setDescription(payload.getDescription());
        product.setImages(payload.getImages());
        if ("rejected".equals(product.getStatus())) product.setStatus("pending_review");
        message(userId, "商品信息已更新", "「" + product.getTitle() + "」的信息已保存。", "system");
        return copyProduct(product, userId);
    }

    public void deleteProduct(Long id, Long userId) {
        Product product = productOrThrow(id);
        if (!Objects.equals(product.getSellerId(), userId)) throw new BusinessException("只能删除自己发布的商品");
        if (!List.of("pending_review", "off_shelf", "rejected").contains(product.getStatus())) throw new BusinessException("当前状态不可删除");
        store.products.removeIf(item -> Objects.equals(item.getId(), id));
        store.favorites.removeIf(key -> key.endsWith(":" + id));
    }

    public List<Product> myProducts(Long userId) {
        return store.products.stream()
                .filter(item -> Objects.equals(item.getSellerId(), userId))
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .map(item -> copyProduct(item, userId))
                .toList();
    }

    public Product offShelfMyProduct(Long id, Long userId) {
        Product product = productOrThrow(id);
        if (!Objects.equals(product.getSellerId(), userId)) throw new BusinessException("只能下架自己发布的商品");
        if (!List.of("on_sale", "pending_review").contains(product.getStatus())) throw new BusinessException("当前状态不可下架");
        product.setStatus("off_shelf");
        message(userId, "商品已下架", "你已下架「" + product.getTitle() + "」。", "system");
        return copyProduct(product, userId);
    }

    public Product favorite(Long productId, Long userId) {
        Product product = productOrThrow(productId);
        String key = userId + ":" + productId;
        if (store.favorites.add(key)) {
            product.setFavoriteCount(product.getFavoriteCount() + 1);
        }
        return copyProduct(product, userId);
    }

    public Product unfavorite(Long productId, Long userId) {
        Product product = productOrThrow(productId);
        String key = userId + ":" + productId;
        if (store.favorites.remove(key)) {
            product.setFavoriteCount(Math.max(0, product.getFavoriteCount() - 1));
        }
        return copyProduct(product, userId);
    }

    public List<Product> favorites(Long userId) {
        return store.products.stream()
                .filter(item -> store.favorites.contains(userId + ":" + item.getId()))
                .map(item -> copyProduct(item, userId))
                .toList();
    }

    public PageResult<Order> orders(Map<String, String> query, Long userId, boolean admin) {
        String type = query.getOrDefault("type", "all");
        String status = query.getOrDefault("status", "");
        Stream<Order> stream = store.orders.stream();
        if (!admin) {
            if ("buy".equals(type)) stream = stream.filter(item -> Objects.equals(item.getBuyerId(), userId));
            else if ("sell".equals(type)) stream = stream.filter(item -> Objects.equals(item.getSellerId(), userId));
            else stream = stream.filter(item -> Objects.equals(item.getBuyerId(), userId) || Objects.equals(item.getSellerId(), userId));
        }
        if (!status.isBlank()) stream = stream.filter(item -> status.equals(item.getStatus()));
        List<Order> list = stream.sorted(Comparator.comparing(Order::getCreatedAt).reversed()).toList();
        return page(list, query);
    }

    public Order orderDetail(Long id, Long userId, boolean admin) {
        Order order = orderOrThrow(id);
        if (!admin && !Objects.equals(order.getBuyerId(), userId) && !Objects.equals(order.getSellerId(), userId)) {
            throw new BusinessException("无权查看该订单");
        }
        return order;
    }

    public Order createOrder(Map<String, Object> payload, Long userId) {
        Long productId = Long.valueOf(String.valueOf(payload.get("productId")));
        Product product = productOrThrow(productId);
        if (!"on_sale".equals(product.getStatus())) throw new BusinessException("商品当前不可下单");
        if (Objects.equals(product.getSellerId(), userId)) throw new BusinessException("不能购买自己发布的商品");
        User buyer = userOrThrow(userId);

        Order order = new Order();
        order.setId(store.nextOrderId());
        order.setOrderNo("CM" + System.currentTimeMillis());
        order.setProductId(product.getId());
        order.setProductTitle(product.getTitle());
        order.setProductImage(product.getImages().isEmpty() ? "" : product.getImages().get(0));
        order.setPrice(product.getPrice());
        order.setBuyerId(userId);
        order.setBuyerName(buyer.getNickname());
        order.setSellerId(product.getSellerId());
        order.setSellerName(product.getSellerName());
        order.setContact(String.valueOf(payload.getOrDefault("contact", "")));
        order.setRemark(payload.get("remark") == null ? null : String.valueOf(payload.get("remark")));
        order.setStatus("pending_confirm");
        order.setCreatedAt(store.now());
        order.getTimeline().add(new OrderTimeline("pending_confirm", "买家提交订单", store.now(), "等待卖家确认"));
        product.setStatus("locked");
        store.orders.add(0, order);
        message(product.getSellerId(), "有新的购买订单", buyer.getNickname() + " 想购买「" + product.getTitle() + "」，请尽快确认。", "order");
        message(userId, "订单提交成功", "你购买「" + product.getTitle() + "」的订单已提交。", "order");
        return order;
    }

    public Order updateOrderStatus(Long id, String status, Long userId) {
        Order order = orderOrThrow(id);
        Product product = productOrThrow(order.getProductId());
        boolean buyer = Objects.equals(order.getBuyerId(), userId);
        boolean seller = Objects.equals(order.getSellerId(), userId);
        if (!buyer && !seller) throw new BusinessException("无权操作该订单");
        if ("confirmed".equals(status) && (!seller || !"pending_confirm".equals(order.getStatus()))) throw new BusinessException("只有卖家可确认待确认订单");
        if ("cancelled".equals(status) && !"pending_confirm".equals(order.getStatus())) throw new BusinessException("仅待确认订单可取消");
        if ("completed".equals(status) && !List.of("confirmed", "abnormal").contains(order.getStatus())) throw new BusinessException("当前订单不可完成");
        if ("abnormal".equals(status) && !List.of("pending_confirm", "confirmed").contains(order.getStatus())) throw new BusinessException("当前订单不可标记异常");
        order.setStatus(status);
        order.getTimeline().add(new OrderTimeline(status, statusLabel(status), store.now(), null));
        if ("cancelled".equals(status)) product.setStatus("on_sale");
        if ("completed".equals(status)) product.setStatus("sold");
        if ("abnormal".equals(status)) message(1L, "出现异常订单", "订单 " + order.getOrderNo() + " 被标记为异常，请处理。", "abnormal");
        message(order.getBuyerId(), "订单状态更新", "订单 " + order.getOrderNo() + " 已变更为 " + statusLabel(status) + "。", "abnormal".equals(status) ? "abnormal" : "order");
        message(order.getSellerId(), "订单状态更新", "订单 " + order.getOrderNo() + " 已变更为 " + statusLabel(status) + "。", "abnormal".equals(status) ? "abnormal" : "order");
        return order;
    }

    public List<Message> messages(Long userId) {
        return store.messages.stream()
                .filter(item -> Objects.equals(item.getUserId(), userId))
                .sorted(Comparator.comparing(Message::getCreatedAt).reversed())
                .toList();
    }

    public Message readMessage(Long id, Long userId) {
        Message message = store.messages.stream()
                .filter(item -> Objects.equals(item.getId(), id) && Objects.equals(item.getUserId(), userId))
                .findFirst()
                .orElseThrow(() -> new BusinessException("消息不存在"));
        message.setRead(true);
        return message;
    }

    public void readAllMessages(Long userId) {
        store.messages.forEach(item -> {
            if (Objects.equals(item.getUserId(), userId)) item.setRead(true);
        });
    }

    public void deleteMessage(Long id, Long userId) {
        store.messages.removeIf(item -> Objects.equals(item.getId(), id) && Objects.equals(item.getUserId(), userId));
    }

    public Map<String, Object> dashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("productTotal", store.products.size());
        data.put("pendingProducts", store.products.stream().filter(item -> "pending_review".equals(item.getStatus())).count());
        data.put("userTotal", store.users.stream().filter(item -> "user".equals(item.getRole())).count());
        data.put("orderTotal", store.orders.size());
        data.put("abnormalOrders", store.orders.stream().filter(item -> "abnormal".equals(item.getStatus())).count());
        data.put("publishTrend", java.util.stream.IntStream.range(0, 7).mapToObj(i -> {
            LocalDate date = LocalDate.now().minusDays(6L - i);
            Map<String, Object> row = new HashMap<>();
            row.put("date", date.getMonthValue() + "/" + date.getDayOfMonth());
            row.put("count", store.products.stream().filter(item -> item.getCreatedAt().startsWith(date.toString())).count());
            return row;
        }).toList());
        data.put("orderStatus", List.of("pending_confirm", "confirmed", "completed", "cancelled", "abnormal").stream().map(status -> {
            Map<String, Object> row = new HashMap<>();
            row.put("status", status);
            row.put("count", store.orders.stream().filter(item -> status.equals(item.getStatus())).count());
            return row;
        }).toList());
        return data;
    }

    public List<Product> reviewProducts() {
        return store.products.stream()
                .filter(item -> "pending_review".equals(item.getStatus()))
                .sorted(Comparator.comparing(Product::getCreatedAt).reversed())
                .toList();
    }

    public Product approveProduct(Long id) {
        Product product = productOrThrow(id);
        product.setStatus("on_sale");
        product.setRejectReason(null);
        message(product.getSellerId(), "商品审核通过", "你发布的「" + product.getTitle() + "」已上架展示。", "review");
        return product;
    }

    public Product rejectProduct(Long id, String reason) {
        Product product = productOrThrow(id);
        product.setStatus("rejected");
        product.setRejectReason(reason);
        message(product.getSellerId(), "商品审核未通过", "「" + product.getTitle() + "」未通过审核：" + reason, "review");
        return product;
    }

    public Product adminOffShelf(Long id, String reason) {
        Product product = productOrThrow(id);
        product.setStatus("off_shelf");
        message(product.getSellerId(), "商品被管理员下架", "「" + product.getTitle() + "」已下架，原因：" + reason, "system");
        return product;
    }

    public List<Map<String, Object>> adminUsers(String keyword) {
        String lower = keyword == null ? "" : keyword.trim().toLowerCase();
        return store.users.stream()
                .filter(item -> "user".equals(item.getRole()))
                .filter(item -> lower.isBlank() || (item.getUsername() + item.getNickname()).toLowerCase().contains(lower))
                .map(user -> {
                    Map<String, Object> row = new HashMap<>();
                    User safe = safeUser(user);
                    row.put("id", safe.getId());
                    row.put("username", safe.getUsername());
                    row.put("nickname", safe.getNickname());
                    row.put("role", safe.getRole());
                    row.put("phone", safe.getPhone());
                    row.put("avatar", safe.getAvatar());
                    row.put("status", safe.getStatus());
                    row.put("createdAt", safe.getCreatedAt());
                    row.put("productCount", store.products.stream().filter(product -> Objects.equals(product.getSellerId(), user.getId())).count());
                    row.put("orderCount", store.orders.stream().filter(order -> Objects.equals(order.getBuyerId(), user.getId()) || Objects.equals(order.getSellerId(), user.getId())).count());
                    return row;
                }).toList();
    }

    public User updateUserStatus(Long id, String status) {
        User user = userOrThrow(id);
        user.setStatus(status);
        message(id, "disabled".equals(status) ? "账号已被禁用" : "账号已恢复", "disabled".equals(status) ? "你的账号已被管理员禁用。" : "你的账号已恢复正常。", "system");
        return safeUser(user);
    }

    public Order handleAbnormal(Long id, String status, String note) {
        Order order = orderOrThrow(id);
        if (!"abnormal".equals(order.getStatus())) throw new BusinessException("只能处理异常订单");
        Product product = productOrThrow(order.getProductId());
        order.setStatus(status);
        order.setHandleNote(note);
        order.getTimeline().add(new OrderTimeline(status, "管理员处理异常订单", store.now(), note));
        product.setStatus("completed".equals(status) ? "sold" : "on_sale");
        message(order.getBuyerId(), "异常订单已处理", "订单 " + order.getOrderNo() + " 已处理：" + note, "abnormal");
        message(order.getSellerId(), "异常订单已处理", "订单 " + order.getOrderNo() + " 已处理：" + note, "abnormal");
        return order;
    }

    public void message(Long userId, String title, String content, String type) {
        store.messages.add(0, new Message(store.nextMessageId(), userId, title, content, type, false, store.now()));
    }

    public User safeUser(User user) {
        return new User(user.getId(), user.getUsername(), null, user.getNickname(), user.getRole(), user.getPhone(), user.getAvatar(), user.getStatus(), user.getCreatedAt());
    }

    public User userOrThrow(Long id) {
        return store.users.stream().filter(item -> Objects.equals(item.getId(), id)).findFirst().orElseThrow(() -> new BusinessException("用户不存在"));
    }

    public Product productOrThrow(Long id) {
        return store.products.stream().filter(item -> Objects.equals(item.getId(), id)).findFirst().orElseThrow(() -> new BusinessException("商品不存在"));
    }

    public Order orderOrThrow(Long id) {
        return store.orders.stream().filter(item -> Objects.equals(item.getId(), id)).findFirst().orElseThrow(() -> new BusinessException("订单不存在"));
    }

    private Product copyProduct(Product item, Long userId) {
        Product product = new Product();
        product.setId(item.getId());
        product.setTitle(item.getTitle());
        product.setCategory(item.getCategory());
        product.setPrice(item.getPrice());
        product.setCondition(item.getCondition());
        product.setLocation(item.getLocation());
        product.setDescription(item.getDescription());
        product.setImages(item.getImages());
        product.setSellerId(item.getSellerId());
        product.setSellerName(item.getSellerName());
        product.setStatus(item.getStatus());
        product.setViewCount(item.getViewCount());
        product.setFavoriteCount(item.getFavoriteCount());
        product.setRejectReason(item.getRejectReason());
        product.setCreatedAt(item.getCreatedAt());
        product.setContact(item.getContact());
        product.setFavorited(userId != null && store.favorites.contains(userId + ":" + item.getId()));
        return product;
    }

    private <T> PageResult<T> page(List<T> list, Map<String, String> query) {
        int page = parseInt(query.get("page"), 1);
        int pageSize = parseInt(query.get("pageSize"), 10);
        int start = Math.max(0, (page - 1) * pageSize);
        int end = Math.min(list.size(), start + pageSize);
        return new PageResult<>(start > list.size() ? List.of() : list.subList(start, end), list.size(), page, pageSize);
    }

    private int parseInt(String value, int fallback) {
        try {
            return value == null || value.isBlank() ? fallback : Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private double parseDouble(String value, double fallback) {
        try {
            return value == null || value.isBlank() ? fallback : Double.parseDouble(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private String statusLabel(String status) {
        return switch (status) {
            case "confirmed" -> "卖家已确认";
            case "completed" -> "交易完成";
            case "cancelled" -> "已取消";
            case "abnormal" -> "异常订单";
            default -> "待卖家确认";
        };
    }
}
