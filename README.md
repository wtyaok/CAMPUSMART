# CampusMart 校园二手交易与订单管理系统

CampusMart 是一个面向校园学生的二手交易与订单管理系统，适合前端实习项目展示。项目包含 Vue 3 前台、管理员后台、订单状态流转、消息通知和轻量 Spring Boot REST API。

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

## 在线访问

GitHub Pages 部署地址：

```text
https://wtyaok.github.io/CAMPUSMART/
```

部署由 `.github/workflows/deploy-pages.yml` 自动完成。推送到 `main` 分支后，GitHub Actions 会构建 `frontend/dist` 并发布到 Pages。

首次部署如果访问地址返回 404，请在 GitHub 仓库页面进入 `Settings` → `Pages`，将 `Build and deployment` 的 `Source` 设置为 `Deploy from a branch`，分支选择 `gh-pages`，目录选择 `/ (root)`，保存后等待 1-3 分钟即可访问。

## 前端运行

默认使用前端 mock 数据，最适合直接演示完整业务闭环。

```bash
cd frontend
npm install
npm run dev
```

访问：`http://localhost:5173`

构建：

```bash
cd frontend
npm run build
```

如需连接 Spring Boot 后端，启动后端后设置：

```bash
cd frontend
$env:VITE_USE_MOCK="false"
npm run dev
```

## 后端运行

需要 Java 17 和 Maven。

```bash
cd backend
mvn spring-boot:run
```

后端地址：`http://localhost:8080`

后端使用内存 seed 数据，重启后恢复初始数据；主要用于支撑前端演示，不做复杂持久化。

## Docker Compose

```bash
docker compose up -d
```

包含：

- MySQL：`localhost:3306`，库名/账号/密码均为 `campusmart`
- Redis：`localhost:6379`

当前 Spring Boot 演示后端默认不依赖数据库，Docker 服务用于满足本地环境和后续扩展。

## 主要接口

- Auth：`POST /api/auth/login`、`POST /api/auth/register`、`GET /api/auth/me`
- Product：`GET /api/products`、`GET /api/products/{id}`、`POST /api/products`、`PUT /api/products/{id}`、`DELETE /api/products/{id}`、`GET /api/products/my`
- Favorite：`POST /api/products/{id}/favorite`、`DELETE /api/products/{id}/favorite`、`GET /api/favorites`
- Order：`GET /api/orders`、`GET /api/orders/{id}`、`POST /api/orders`、`PUT /api/orders/{id}/status`
- Message：`GET /api/messages`、`PUT /api/messages/{id}/read`、`PUT /api/messages/read-all`、`DELETE /api/messages/{id}`
- Admin：`GET /api/admin/dashboard`、`GET /api/admin/products/review`、`PUT /api/admin/products/{id}/approve`、`PUT /api/admin/products/{id}/reject`、`PUT /api/admin/products/{id}/off-shelf`、`GET /api/admin/users`、`PUT /api/admin/users/{id}/status`、`GET /api/admin/orders`、`PUT /api/admin/orders/{id}/handle`

统一返回结构：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

## 截图占位

- 登录页：居中登录卡片、测试账号提示、角色跳转
- 前台首页：Banner、分类入口、推荐商品
- 商品列表：搜索筛选、分页、卡片 hover
- 商品详情：轮播图、收藏、下单弹窗
- 我的订单：买入/卖出、状态按钮、详情时间线
- 管理后台：工作台、审核、商品/用户/订单管理
