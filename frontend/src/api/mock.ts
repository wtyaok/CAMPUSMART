import { categories, campusLocations } from '@/utils/constants';
import { makeOrderNo } from '@/utils/format';
import type {
  DashboardStats,
  LoginPayload,
  Message,
  Order,
  OrderQuery,
  OrderStatus,
  PageResult,
  Product,
  ProductQuery,
  ProductStatus,
  RegisterPayload,
  User,
  UserStatus
} from '@/types';

interface StoredUser extends User {
  password: string;
}

interface FavoriteRecord {
  userId: number;
  productId: number;
}

interface CampusDb {
  users: StoredUser[];
  products: Product[];
  orders: Order[];
  messages: Message[];
  favorites: FavoriteRecord[];
}

const DB_KEY = 'campus-mart-db';
const LATENCY = 220;

const imagePool = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80'
];

function now(offsetHours = 0) {
  return new Date(Date.now() + offsetHours * 60 * 60 * 1000).toISOString();
}

function seedDb(): CampusDb {
  const users: StoredUser[] = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      nickname: '后台管理员',
      role: 'admin',
      phone: '18800000001',
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Admin',
      status: 'normal',
      createdAt: now(-240)
    },
    {
      id: 2,
      username: 'user',
      password: 'user123',
      nickname: '林同学',
      role: 'user',
      phone: '18800000002',
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Lin',
      status: 'normal',
      createdAt: now(-200)
    },
    {
      id: 3,
      username: 'momo',
      password: 'momo123',
      nickname: '莫学姐',
      role: 'user',
      phone: '18800000003',
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Mo',
      status: 'normal',
      createdAt: now(-170)
    },
    {
      id: 4,
      username: 'chen',
      password: 'chen123',
      nickname: '陈同学',
      role: 'user',
      phone: '18800000004',
      avatar: 'https://api.dicebear.com/8.x/initials/svg?seed=Chen',
      status: 'disabled',
      createdAt: now(-120)
    }
  ];

  const products: Product[] = [
    {
      id: 1,
      title: 'iPad Air 5 64G 蓝色，带原装保护壳',
      category: '数码电子',
      price: 2650,
      condition: '九成新',
      location: '图书馆门口',
      description: '考研期间主要用来看网课，屏幕无划痕，电池状态很好。包含保护壳和电容笔替芯，支持现场验机。',
      images: [imagePool[0]],
      sellerId: 3,
      sellerName: '莫学姐',
      status: 'on_sale',
      viewCount: 168,
      favoriteCount: 15,
      contact: '微信 momo-campus',
      createdAt: now(-32)
    },
    {
      id: 2,
      title: '高等数学同济第七版 + 线代教材打包',
      category: '图书教材',
      price: 38,
      condition: '八成新',
      location: '教学楼 A 座',
      description: '部分章节有笔记，重点题型标注比较全，适合期末复习。两本一起出，不单卖。',
      images: [imagePool[1]],
      sellerId: 2,
      sellerName: '林同学',
      status: 'on_sale',
      viewCount: 92,
      favoriteCount: 8,
      contact: '手机号 18800000002',
      createdAt: now(-18)
    },
    {
      id: 3,
      title: 'Nike 跑鞋 42 码，操场夜跑闲置',
      category: '服饰鞋包',
      price: 169,
      condition: '七成新',
      location: '东区宿舍',
      description: '鞋底磨损正常，无开胶。适合日常跑步和健身房训练，支持宿舍楼下试穿。',
      images: [imagePool[2]],
      sellerId: 3,
      sellerName: '莫学姐',
      status: 'locked',
      viewCount: 75,
      favoriteCount: 6,
      contact: 'QQ 80123456',
      createdAt: now(-12)
    },
    {
      id: 4,
      title: '宿舍小推车三层置物架',
      category: '生活用品',
      price: 45,
      condition: '九成新',
      location: '西区食堂',
      description: '白色三层，可放零食和洗漱用品。毕业搬宿舍转出，轮子顺滑，配件完整。',
      images: [imagePool[3]],
      sellerId: 2,
      sellerName: '林同学',
      status: 'pending_review',
      viewCount: 21,
      favoriteCount: 1,
      contact: '微信 lin-campus',
      createdAt: now(-4)
    },
    {
      id: 5,
      title: '羽毛球拍双拍套装，含球和拍包',
      category: '运动户外',
      price: 88,
      condition: '八成新',
      location: '体育馆',
      description: '入门训练拍，线和手胶状态正常。平时体育课用过几次，适合新手。',
      images: [imagePool[4]],
      sellerId: 3,
      sellerName: '莫学姐',
      status: 'sold',
      viewCount: 113,
      favoriteCount: 9,
      contact: '微信 momo-campus',
      createdAt: now(-60)
    },
    {
      id: 6,
      title: 'Switch Pro 手柄，按键灵敏',
      category: '数码电子',
      price: 210,
      condition: '九成新',
      location: '南门自提点',
      description: '原装手柄，摇杆无漂移。因换设备闲置，支持当场连接测试。',
      images: [imagePool[5]],
      sellerId: 2,
      sellerName: '林同学',
      status: 'rejected',
      rejectReason: '商品图片不够清晰，请补充实物正反面照片。',
      viewCount: 35,
      favoriteCount: 2,
      contact: '手机号 18800000002',
      createdAt: now(-9)
    }
  ];

  const orders: Order[] = [
    {
      id: 1,
      orderNo: 'CM20260626001',
      productId: 3,
      productTitle: products[2].title,
      productImage: products[2].images[0],
      price: products[2].price,
      buyerId: 2,
      buyerName: '林同学',
      sellerId: 3,
      sellerName: '莫学姐',
      contact: '微信 lin-campus',
      remark: '今晚体育馆门口方便交易。',
      status: 'confirmed',
      timeline: [
        { status: 'pending_confirm', label: '买家提交订单', time: now(-9), note: '等待卖家确认' },
        { status: 'confirmed', label: '卖家确认交易', time: now(-7), note: '约定线下自提' }
      ],
      createdAt: now(-9)
    },
    {
      id: 2,
      orderNo: 'CM20260625002',
      productId: 5,
      productTitle: products[4].title,
      productImage: products[4].images[0],
      price: products[4].price,
      buyerId: 2,
      buyerName: '林同学',
      sellerId: 3,
      sellerName: '莫学姐',
      contact: '手机号 18800000002',
      remark: '已线下验货。',
      status: 'completed',
      timeline: [
        { status: 'pending_confirm', label: '买家提交订单', time: now(-54) },
        { status: 'confirmed', label: '卖家确认交易', time: now(-50) },
        { status: 'completed', label: '交易完成', time: now(-46), note: '双方确认完成' }
      ],
      createdAt: now(-54)
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      userId: 2,
      title: '订单已被卖家确认',
      content: '你购买的 Nike 跑鞋订单已确认，请按约定时间线下交易。',
      type: 'order',
      read: false,
      createdAt: now(-7)
    },
    {
      id: 2,
      userId: 2,
      title: '商品审核待处理',
      content: '你发布的宿舍小推车已进入管理员审核队列。',
      type: 'review',
      read: true,
      createdAt: now(-4)
    },
    {
      id: 3,
      userId: 3,
      title: '有新的购买订单',
      content: '林同学提交了 Nike 跑鞋订单，请尽快确认。',
      type: 'order',
      read: false,
      createdAt: now(-9)
    }
  ];

  return {
    users,
    products,
    orders,
    messages,
    favorites: [
      { userId: 2, productId: 1 },
      { userId: 2, productId: 5 },
      { userId: 3, productId: 2 }
    ]
  };
}

function loadDb(): CampusDb {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const db = seedDb();
    saveDb(db);
    return db;
  }
  return JSON.parse(raw) as CampusDb;
}

function saveDb(db: CampusDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(value), LATENCY));
}

function fail(message: string): never {
  throw new Error(message);
}

function nextId(items: { id: number }[]) {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

function stripPassword(user: StoredUser): User {
  const { password: _password, ...rest } = user;
  return rest;
}

function paginate<T>(items: T[], page = 1, pageSize = 12): PageResult<T> {
  const start = (page - 1) * pageSize;
  return {
    list: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize
  };
}

function currentUserId() {
  const raw = localStorage.getItem('campus-mart-auth');
  if (!raw) return 0;
  try {
    return JSON.parse(raw).user?.id || 0;
  } catch {
    return 0;
  }
}

function withFavorite(product: Product, db: CampusDb, userId = currentUserId()): Product {
  return {
    ...product,
    favorited: db.favorites.some((item) => item.userId === userId && item.productId === product.id)
  };
}

function createMessage(db: CampusDb, userId: number, title: string, content: string, type: Message['type']) {
  db.messages.unshift({
    id: nextId(db.messages),
    userId,
    title,
    content,
    type,
    read: false,
    createdAt: now()
  });
}

function getProductOrThrow(db: CampusDb, id: number) {
  return db.products.find((item) => item.id === id) || fail('商品不存在');
}

function getOrderOrThrow(db: CampusDb, id: number) {
  return db.orders.find((item) => item.id === id) || fail('订单不存在');
}

export const mockApi = {
  async login(payload: LoginPayload) {
    const db = loadDb();
    const found = db.users.find((user) => user.username === payload.username && user.password === payload.password);
    if (!found) fail('用户名或密码错误');
    if (found.status === 'disabled') fail('账号已被禁用，请联系管理员');
    return delay({
      token: `mock-token-${found.id}-${Date.now()}`,
      user: stripPassword(found)
    });
  },

  async register(payload: RegisterPayload) {
    const db = loadDb();
    if (db.users.some((user) => user.username === payload.username)) fail('用户名已存在');
    const user: StoredUser = {
      id: nextId(db.users),
      username: payload.username,
      password: payload.password,
      nickname: payload.nickname,
      role: 'user',
      phone: payload.phone,
      avatar: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(payload.nickname)}`,
      status: 'normal',
      createdAt: now()
    };
    db.users.push(user);
    saveDb(db);
    return delay(stripPassword(user));
  },

  async me(userId: number) {
    const db = loadDb();
    const user = db.users.find((item) => item.id === userId) || fail('登录已过期');
    return delay(stripPassword(user));
  },

  async products(query: ProductQuery = {}) {
    const db = loadDb();
    const keyword = query.keyword?.trim().toLowerCase();
    let items = db.products
      .filter((item) => (query.status ? item.status === query.status : item.status === 'on_sale'))
      .filter((item) => (query.category ? item.category === query.category : true))
      .filter((item) => (keyword ? `${item.title}${item.description}${item.sellerName}`.toLowerCase().includes(keyword) : true))
      .filter((item) => (query.minPrice ? item.price >= query.minPrice : true))
      .filter((item) => (query.maxPrice ? item.price <= query.maxPrice : true));

    if (query.sort === 'priceAsc') items = items.sort((a, b) => a.price - b.price);
    else if (query.sort === 'priceDesc') items = items.sort((a, b) => b.price - a.price);
    else items = items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return delay(paginate(items.map((item) => withFavorite(item, db)), query.page, query.pageSize));
  },

  async productDetail(id: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    product.viewCount += 1;
    saveDb(db);
    return delay(withFavorite(product, db));
  },

  async createProduct(payload: Omit<Product, 'id' | 'sellerId' | 'sellerName' | 'status' | 'viewCount' | 'favoriteCount' | 'createdAt'>, userId: number) {
    const db = loadDb();
    const seller = db.users.find((item) => item.id === userId) || fail('用户不存在');
    if (seller.status === 'disabled') fail('账号已被禁用，不能发布商品');
    const product: Product = {
      ...payload,
      id: nextId(db.products),
      sellerId: userId,
      sellerName: seller.nickname,
      status: 'pending_review',
      viewCount: 0,
      favoriteCount: 0,
      createdAt: now()
    };
    db.products.unshift(product);
    createMessage(db, userId, '商品提交成功', `你发布的「${product.title}」已进入审核。`, 'review');
    saveDb(db);
    return delay(product);
  },

  async updateProduct(id: number, payload: Partial<Product>, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    if (product.sellerId !== userId) fail('只能编辑自己发布的商品');
    if (!['pending_review', 'on_sale', 'rejected'].includes(product.status)) fail('当前状态不可编辑');
    Object.assign(product, payload, { status: product.status === 'rejected' ? 'pending_review' : product.status });
    if (payload.title || payload.description || payload.images) {
      createMessage(db, userId, '商品信息已更新', `「${product.title}」的信息已保存。`, 'system');
    }
    saveDb(db);
    return delay(product);
  },

  async deleteProduct(id: number, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    if (product.sellerId !== userId) fail('只能删除自己发布的商品');
    if (!['rejected', 'off_shelf', 'pending_review'].includes(product.status)) fail('仅草稿、下架或审核失败商品可删除');
    db.products = db.products.filter((item) => item.id !== id);
    db.favorites = db.favorites.filter((item) => item.productId !== id);
    saveDb(db);
    return delay(true);
  },

  async myProducts(userId: number) {
    const db = loadDb();
    return delay(db.products.filter((item) => item.sellerId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async offShelfMyProduct(id: number, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    if (product.sellerId !== userId) fail('只能下架自己发布的商品');
    if (!['on_sale', 'pending_review'].includes(product.status)) fail('当前状态不可下架');
    product.status = 'off_shelf';
    createMessage(db, userId, '商品已下架', `你已下架「${product.title}」。`, 'system');
    saveDb(db);
    return delay(product);
  },

  async favorite(productId: number, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, productId);
    if (!db.favorites.some((item) => item.userId === userId && item.productId === productId)) {
      db.favorites.push({ userId, productId });
      product.favoriteCount += 1;
      saveDb(db);
    }
    return delay(withFavorite(product, db, userId));
  },

  async unfavorite(productId: number, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, productId);
    const before = db.favorites.length;
    db.favorites = db.favorites.filter((item) => !(item.userId === userId && item.productId === productId));
    if (db.favorites.length !== before) product.favoriteCount = Math.max(0, product.favoriteCount - 1);
    saveDb(db);
    return delay(withFavorite(product, db, userId));
  },

  async favorites(userId: number) {
    const db = loadDb();
    const ids = db.favorites.filter((item) => item.userId === userId).map((item) => item.productId);
    return delay(db.products.filter((item) => ids.includes(item.id)).map((item) => withFavorite(item, db, userId)));
  },

  async orders(query: OrderQuery = {}, userId: number) {
    const db = loadDb();
    let items = db.orders;
    if (query.type === 'buy') items = items.filter((item) => item.buyerId === userId);
    else if (query.type === 'sell') items = items.filter((item) => item.sellerId === userId);
    else items = items.filter((item) => item.buyerId === userId || item.sellerId === userId);
    if (query.status) items = items.filter((item) => item.status === query.status);
    items = items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(paginate(items, query.page, query.pageSize));
  },

  async orderDetail(id: number, userId: number) {
    const db = loadDb();
    const order = getOrderOrThrow(db, id);
    if (![order.buyerId, order.sellerId].includes(userId)) fail('无权查看该订单');
    return delay(order);
  },

  async createOrder(payload: { productId: number; contact: string; remark?: string }, userId: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, payload.productId);
    if (product.status !== 'on_sale') fail('商品当前不可下单');
    if (product.sellerId === userId) fail('不能购买自己发布的商品');
    const buyer = db.users.find((item) => item.id === userId) || fail('用户不存在');
    const order: Order = {
      id: nextId(db.orders),
      orderNo: makeOrderNo(),
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      price: product.price,
      buyerId: userId,
      buyerName: buyer.nickname,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      contact: payload.contact,
      remark: payload.remark,
      status: 'pending_confirm',
      timeline: [{ status: 'pending_confirm', label: '买家提交订单', time: now(), note: '等待卖家确认' }],
      createdAt: now()
    };
    product.status = 'locked';
    db.orders.unshift(order);
    createMessage(db, product.sellerId, '有新的购买订单', `${buyer.nickname} 想购买「${product.title}」，请尽快确认。`, 'order');
    createMessage(db, userId, '订单提交成功', `你购买「${product.title}」的订单已提交。`, 'order');
    saveDb(db);
    return delay(order);
  },

  async updateOrderStatus(id: number, status: OrderStatus, userId: number, note?: string) {
    const db = loadDb();
    const order = getOrderOrThrow(db, id);
    const product = getProductOrThrow(db, order.productId);
    const isBuyer = order.buyerId === userId;
    const isSeller = order.sellerId === userId;
    if (!isBuyer && !isSeller) fail('无权操作该订单');

    if (status === 'confirmed' && (!isSeller || order.status !== 'pending_confirm')) fail('只有卖家可确认待确认订单');
    if (status === 'cancelled' && order.status !== 'pending_confirm') fail('仅待确认订单可取消');
    if (status === 'completed' && !['confirmed', 'abnormal'].includes(order.status)) fail('当前订单不可完成');
    if (status === 'abnormal' && !['pending_confirm', 'confirmed'].includes(order.status)) fail('当前订单不可标记异常');

    order.status = status;
    order.timeline.push({
      status,
      label:
        status === 'confirmed'
          ? '卖家确认交易'
          : status === 'completed'
            ? '确认交易完成'
            : status === 'cancelled'
              ? '订单取消'
              : '标记异常订单',
      time: now(),
      note
    });

    if (status === 'cancelled') product.status = 'on_sale';
    if (status === 'completed') product.status = 'sold';
    if (status === 'abnormal') {
      product.status = 'locked';
      createMessage(db, 1, '出现异常订单', `订单 ${order.orderNo} 被标记为异常，请处理。`, 'abnormal');
    }

    createMessage(db, order.buyerId, '订单状态更新', `订单 ${order.orderNo} 已变更为「${status}」。`, status === 'abnormal' ? 'abnormal' : 'order');
    createMessage(db, order.sellerId, '订单状态更新', `订单 ${order.orderNo} 已变更为「${status}」。`, status === 'abnormal' ? 'abnormal' : 'order');
    saveDb(db);
    return delay(order);
  },

  async messages(userId: number) {
    const db = loadDb();
    return delay(db.messages.filter((item) => item.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async readMessage(id: number, userId: number) {
    const db = loadDb();
    const message = db.messages.find((item) => item.id === id && item.userId === userId) || fail('消息不存在');
    message.read = true;
    saveDb(db);
    return delay(message);
  },

  async readAllMessages(userId: number) {
    const db = loadDb();
    db.messages.forEach((item) => {
      if (item.userId === userId) item.read = true;
    });
    saveDb(db);
    return delay(true);
  },

  async deleteMessage(id: number, userId: number) {
    const db = loadDb();
    db.messages = db.messages.filter((item) => !(item.id === id && item.userId === userId));
    saveDb(db);
    return delay(true);
  },

  async dashboard(): Promise<DashboardStats> {
    const db = loadDb();
    const dates = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000);
      const label = `${date.getMonth() + 1}/${date.getDate()}`;
      return {
        date: label,
        count: db.products.filter((item) => {
          const created = new Date(item.createdAt);
          return created.toDateString() === date.toDateString();
        }).length
      };
    });
    const statuses: OrderStatus[] = ['pending_confirm', 'confirmed', 'completed', 'cancelled', 'abnormal'];
    return delay({
      productTotal: db.products.length,
      pendingProducts: db.products.filter((item) => item.status === 'pending_review').length,
      userTotal: db.users.filter((item) => item.role === 'user').length,
      orderTotal: db.orders.length,
      abnormalOrders: db.orders.filter((item) => item.status === 'abnormal').length,
      publishTrend: dates,
      orderStatus: statuses.map((status) => ({ status, count: db.orders.filter((item) => item.status === status).length }))
    });
  },

  async adminReviewProducts() {
    const db = loadDb();
    return delay(db.products.filter((item) => item.status === 'pending_review').sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async adminProducts(query: ProductQuery = {}) {
    const db = loadDb();
    const keyword = query.keyword?.trim().toLowerCase();
    let items = db.products
      .filter((item) => (query.category ? item.category === query.category : true))
      .filter((item) => (query.status ? item.status === query.status : true))
      .filter((item) => (keyword ? `${item.title}${item.sellerName}`.toLowerCase().includes(keyword) : true));
    items = items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(paginate(items, query.page, query.pageSize));
  },

  async adminApproveProduct(id: number) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    product.status = 'on_sale';
    product.rejectReason = undefined;
    createMessage(db, product.sellerId, '商品审核通过', `你发布的「${product.title}」已上架展示。`, 'review');
    saveDb(db);
    return delay(product);
  },

  async adminRejectProduct(id: number, reason: string) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    product.status = 'rejected';
    product.rejectReason = reason;
    createMessage(db, product.sellerId, '商品审核未通过', `「${product.title}」未通过审核：${reason}`, 'review');
    saveDb(db);
    return delay(product);
  },

  async adminOffShelfProduct(id: number, reason: string) {
    const db = loadDb();
    const product = getProductOrThrow(db, id);
    product.status = 'off_shelf';
    createMessage(db, product.sellerId, '商品被管理员下架', `「${product.title}」已下架，原因：${reason}`, 'system');
    saveDb(db);
    return delay(product);
  },

  async adminUsers(keyword = '') {
    const db = loadDb();
    const lower = keyword.trim().toLowerCase();
    return delay(
      db.users
        .filter((item) => item.role === 'user')
        .filter((item) => (lower ? `${item.username}${item.nickname}`.toLowerCase().includes(lower) : true))
        .map((user) => ({
          ...stripPassword(user),
          productCount: db.products.filter((item) => item.sellerId === user.id).length,
          orderCount: db.orders.filter((item) => item.buyerId === user.id || item.sellerId === user.id).length
        }))
    );
  },

  async adminUserStatus(id: number, status: UserStatus) {
    const db = loadDb();
    const user = db.users.find((item) => item.id === id) || fail('用户不存在');
    user.status = status;
    createMessage(db, id, status === 'disabled' ? '账号已被禁用' : '账号已恢复', status === 'disabled' ? '你的账号已被管理员禁用。' : '你的账号已恢复正常。', 'system');
    saveDb(db);
    return delay(stripPassword(user));
  },

  async adminOrders(query: OrderQuery = {}) {
    const db = loadDb();
    let items = db.orders;
    if (query.status) items = items.filter((item) => item.status === query.status);
    return delay(paginate(items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)), query.page, query.pageSize));
  },

  async adminHandleOrder(id: number, status: 'completed' | 'cancelled', note: string) {
    const db = loadDb();
    const order = getOrderOrThrow(db, id);
    const product = getProductOrThrow(db, order.productId);
    if (order.status !== 'abnormal') fail('只能处理异常订单');
    order.status = status;
    order.handleNote = note;
    order.timeline.push({ status, label: '管理员处理异常订单', time: now(), note });
    product.status = status === 'completed' ? 'sold' : 'on_sale';
    createMessage(db, order.buyerId, '异常订单已处理', `订单 ${order.orderNo} 已处理：${note}`, 'abnormal');
    createMessage(db, order.sellerId, '异常订单已处理', `订单 ${order.orderNo} 已处理：${note}`, 'abnormal');
    saveDb(db);
    return delay(order);
  },

  reset() {
    const db = seedDb();
    saveDb(db);
    return db;
  },

  options() {
    return {
      categories,
      campusLocations
    };
  }
};
