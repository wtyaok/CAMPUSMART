# CampusMart 校园二手交易与订单管理系统

CampusMart 是一个面向校园学生的二手交易与订单管理系统。项目包含 Vue 3 前台、管理员后台、订单状态流转、消息通知和轻量 Spring Boot REST API。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Vue Router、Pinia、Element Plus、Axios、SCSS
- 后端：Spring Boot 3、Maven、内存 seed 数据
- 环境：Docker Compose 提供 MySQL、Redis

## 功能列表

- 普通用户：注册/登录、商品浏览搜索、分类/价格/状态筛选、收藏、发布/编辑/下架商品、我的发布、下单、买入/卖出订单、订单状态流转、消息中心
- 管理员：工作台统计、商品审核、商品管理、用户启用/禁用、订单管理、异常订单处理、消息查看
- 业务联动：发布后待审核，审核通过上架，下单后商品锁定，订单完成后商品售出，审核和订单变化自动生成消息

## 目录结构

```text
.
├─ frontend/          # Vue 3 前端
├─ backend/           # Spring Boot 后端
├─ docker-compose.yml # MySQL / Redis
├─ Require.md         # 原始需求
└─ README.md
```

## 测试账号

- 普通用户：`user / user123`
- 管理员：`admin / admin123`
- seed 中还有 `momo / momo123`，以及被禁用的 `chen / chen123`


