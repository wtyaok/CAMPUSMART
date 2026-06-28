<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowRight, Goods, Location, Lock, Plus, TakeawayBox } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ProductCard from '@/components/ProductCard.vue';
import { favoriteProductApi, getProductsApi, unfavoriteProductApi } from '@/api/product';
import { categories } from '@/utils/constants';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/types';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const products = ref<Product[]>([]);

async function fetchRecommended() {
  loading.value = true;
  try {
    const result = await getProductsApi({ page: 1, pageSize: 8, sort: 'latest' });
    products.value = result.list;
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite(product: Product) {
  if (!auth.user) return;
  const next = product.favorited ? await unfavoriteProductApi(product.id, auth.user.id) : await favoriteProductApi(product.id, auth.user.id);
  Object.assign(product, next);
  ElMessage.success(next.favorited ? '已加入收藏' : '已取消收藏');
}

onMounted(fetchRecommended);
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="page-shell hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">Campus second-hand marketplace</span>
          <h1>让闲置在校园里重新流动</h1>
          <p>同校发布、审核上架、线下自提，买卖双方都能清楚看到订单状态和系统通知。</p>
          <div class="hero-actions">
            <el-button type="primary" size="large" :icon="Plus" @click="router.push('/products/new')">发布闲置</el-button>
            <el-button size="large" :icon="Goods" @click="router.push('/products')">浏览商品</el-button>
          </div>
        </div>
        <div class="hero-panel">
          <div class="deal-card">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80" alt="校园数码闲置" />
            <div>
              <strong>今日推荐</strong>
              <p>iPad Air 5 · 图书馆门口自提</p>
              <span>¥2650.00</span>
            </div>
          </div>
          <div class="mini-metrics">
            <div><strong>6</strong><span>热门分类</span></div>
            <div><strong>2</strong><span>线下订单</span></div>
            <div><strong>3</strong><span>未读通知</span></div>
          </div>
        </div>
      </div>
    </section>

    <section class="page-shell promise-row">
      <div>
        <el-icon><TakeawayBox /></el-icon>
        <strong>低价闲置</strong>
        <span>毕业季、换新季好物集中上架</span>
      </div>
      <div>
        <el-icon><Location /></el-icon>
        <strong>校园自提</strong>
        <span>宿舍楼、图书馆、食堂就近交易</span>
      </div>
      <div>
        <el-icon><Lock /></el-icon>
        <strong>审核交易</strong>
        <span>商品先审核，订单全流程可追踪</span>
      </div>
    </section>

    <section class="page-shell">
      <div class="section-title">
        <div>
          <h2>分类入口</h2>
          <p>按学习、生活、运动等场景快速筛选</p>
        </div>
      </div>
      <div class="category-grid">
        <button v-for="item in categories" :key="item" type="button" @click="router.push({ path: '/products', query: { category: item } })">
          <span>{{ item.slice(0, 2) }}</span>
          <strong>{{ item }}</strong>
          <el-icon><ArrowRight /></el-icon>
        </button>
      </div>
    </section>

    <section class="page-shell">
      <div class="section-title">
        <div>
          <h2>推荐商品</h2>
          <p>近期上架且可交易的校园二手好物</p>
        </div>
        <el-button text type="primary" @click="router.push('/products')">查看全部</el-button>
      </div>
      <el-skeleton v-if="loading" :rows="6" animated />
      <div v-else class="grid-products">
        <ProductCard v-for="product in products" :key="product.id" :product="product" @favorite="toggleFavorite" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  padding-bottom: 26px;
}

.hero {
  background: #eaf2ff;
  border-bottom: 1px solid #dbe7f8;
}

.hero-inner {
  min-height: 360px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  align-items: center;
  gap: 42px;
  padding: 34px 0;
}

.hero-copy {
  .eyebrow {
    color: var(--cm-primary);
    font-weight: 800;
  }

  h1 {
    margin: 12px 0 16px;
    font-size: 44px;
    line-height: 1.16;
  }

  p {
    max-width: 560px;
    color: #475569;
    font-size: 17px;
    line-height: 1.9;
  }
}

.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.hero-panel {
  display: grid;
  gap: 14px;
}

.deal-card {
  overflow: hidden;
  background: #fff;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  box-shadow: var(--cm-shadow);

  img {
    width: 100%;
    height: 190px;
    object-fit: cover;
  }

  div {
    padding: 16px;

    strong,
    span {
      display: block;
    }

    p {
      margin: 6px 0 12px;
      color: var(--cm-muted);
    }

    span {
      color: var(--cm-red);
      font-size: 22px;
      font-weight: 800;
    }
  }
}

.mini-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  div {
    padding: 14px;
    text-align: center;
    background: #fff;
    border: 1px solid var(--cm-border);
    border-radius: 8px;
  }

  strong,
  span {
    display: block;
  }

  strong {
    font-size: 24px;
  }

  span {
    color: var(--cm-muted);
    font-size: 12px;
  }
}

.promise-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-top: 22px;

  div {
    display: grid;
    grid-template-columns: 42px 1fr;
    gap: 2px 12px;
    padding: 18px;
    background: #fff;
    border: 1px solid var(--cm-border);
    border-radius: 8px;

    .el-icon {
      grid-row: span 2;
      width: 42px;
      height: 42px;
      color: var(--cm-primary);
      background: #eef5ff;
      border-radius: 8px;
    }

    span {
      color: var(--cm-muted);
      font-size: 13px;
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;

  button {
    min-height: 92px;
    display: grid;
    grid-template-columns: 44px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 14px;
    text-align: left;
    background: #fff;
    border: 1px solid var(--cm-border);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.18s ease, transform 0.18s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: #9ab7ef;
    }

    span {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      color: #fff;
      background: var(--cm-primary);
      border-radius: 8px;
      font-weight: 800;
    }

    strong {
      font-size: 15px;
    }
  }
}

@media (max-width: 980px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }

  .promise-row,
  .category-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-copy h1 {
    font-size: 32px;
  }

  .promise-row,
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
