package com.campusmart.store;

import com.campusmart.model.Message;
import com.campusmart.model.Order;
import com.campusmart.model.OrderTimeline;
import com.campusmart.model.Product;
import com.campusmart.model.User;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class InMemoryStore {
    public final List<User> users = new ArrayList<>();
    public final List<Product> products = new ArrayList<>();
    public final List<Order> orders = new ArrayList<>();
    public final List<Message> messages = new ArrayList<>();
    public final Set<String> favorites = new HashSet<>();

    private final List<String> images = List.of(
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=900&q=80",
            "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80"
    );

    @PostConstruct
    public void seed() {
        users.clear();
        products.clear();
        orders.clear();
        messages.clear();
        favorites.clear();

        users.add(new User(1L, "admin", "admin123", "后台管理员", "admin", "18800000001", "https://api.dicebear.com/8.x/initials/svg?seed=Admin", "normal", now(-240)));
        users.add(new User(2L, "user", "user123", "林同学", "user", "18800000002", "https://api.dicebear.com/8.x/initials/svg?seed=Lin", "normal", now(-200)));
        users.add(new User(3L, "momo", "momo123", "莫学姐", "user", "18800000003", "https://api.dicebear.com/8.x/initials/svg?seed=Mo", "normal", now(-170)));
        users.add(new User(4L, "chen", "chen123", "陈同学", "user", "18800000004", "https://api.dicebear.com/8.x/initials/svg?seed=Chen", "disabled", now(-120)));

        products.add(new Product(1L, "iPad Air 5 64G 蓝色，带原装保护壳", "数码电子", 2650.0, "九成新", "图书馆门口", "考研期间主要用来看网课，屏幕无划痕，电池状态很好。", List.of(images.get(0)), 3L, "莫学姐", "on_sale", 168, 15, now(-32), "微信 momo-campus"));
        products.add(new Product(2L, "高等数学同济第七版 + 线代教材打包", "图书教材", 38.0, "八成新", "教学楼 A 座", "部分章节有笔记，重点题型标注比较全。", List.of(images.get(1)), 2L, "林同学", "on_sale", 92, 8, now(-18), "手机号 18800000002"));
        products.add(new Product(3L, "Nike 跑鞋 42 码，操场夜跑闲置", "服饰鞋包", 169.0, "七成新", "东区宿舍", "鞋底磨损正常，无开胶。", List.of(images.get(2)), 3L, "莫学姐", "locked", 75, 6, now(-12), "QQ 80123456"));
        products.add(new Product(4L, "宿舍小推车三层置物架", "生活用品", 45.0, "九成新", "西区食堂", "白色三层，可放零食和洗漱用品。", List.of(images.get(3)), 2L, "林同学", "pending_review", 21, 1, now(-4), "微信 lin-campus"));
        products.add(new Product(5L, "羽毛球拍双拍套装，含球和拍包", "运动户外", 88.0, "八成新", "体育馆", "入门训练拍，线和手胶状态正常。", List.of(images.get(4)), 3L, "莫学姐", "sold", 113, 9, now(-60), "微信 momo-campus"));

        Order order = new Order();
        order.setId(1L);
        order.setOrderNo("CM20260626001");
        order.setProductId(3L);
        order.setProductTitle(products.get(2).getTitle());
        order.setProductImage(products.get(2).getImages().get(0));
        order.setPrice(products.get(2).getPrice());
        order.setBuyerId(2L);
        order.setBuyerName("林同学");
        order.setSellerId(3L);
        order.setSellerName("莫学姐");
        order.setContact("微信 lin-campus");
        order.setRemark("今晚体育馆门口方便交易。");
        order.setStatus("confirmed");
        order.setCreatedAt(now(-9));
        order.getTimeline().add(new OrderTimeline("pending_confirm", "买家提交订单", now(-9), "等待卖家确认"));
        order.getTimeline().add(new OrderTimeline("confirmed", "卖家确认交易", now(-7), "约定线下自提"));
        orders.add(order);

        messages.add(new Message(1L, 2L, "订单已被卖家确认", "你购买的 Nike 跑鞋订单已确认，请按约定时间线下交易。", "order", false, now(-7)));
        messages.add(new Message(2L, 2L, "商品审核待处理", "你发布的宿舍小推车已进入管理员审核队列。", "review", true, now(-4)));
        messages.add(new Message(3L, 3L, "有新的购买订单", "林同学提交了 Nike 跑鞋订单，请尽快确认。", "order", false, now(-9)));

        favorites.add("2:1");
        favorites.add("2:5");
        favorites.add("3:2");
    }

    public String now(int offsetHours) {
        return LocalDateTime.now().plusHours(offsetHours).toString();
    }

    public String now() {
        return now(0);
    }

    public long nextUserId() {
        return users.stream().mapToLong(User::getId).max().orElse(0L) + 1;
    }

    public long nextProductId() {
        return products.stream().mapToLong(Product::getId).max().orElse(0L) + 1;
    }

    public long nextOrderId() {
        return orders.stream().mapToLong(Order::getId).max().orElse(0L) + 1;
    }

    public long nextMessageId() {
        return messages.stream().mapToLong(Message::getId).max().orElse(0L) + 1;
    }
}
