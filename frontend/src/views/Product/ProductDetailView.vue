<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { ChatLineRound, Collection, Location, Star, StarFilled, Tickets, View } from '@element-plus/icons-vue';
import EmptyState from '@/components/EmptyState.vue';
import StatusTag from '@/components/StatusTag.vue';
import { createOrderApi } from '@/api/order';
import { favoriteProductApi, getProductDetailApi, unfavoriteProductApi } from '@/api/product';
import { money, shortDate } from '@/utils/format';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const orderLoading = ref(false);
const product = ref<Product | null>(null);
const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const orderForm = reactive({
  contact: auth.user?.phone || '',
  remark: ''
});

const rules: FormRules = {
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
};

const isOwner = computed(() => product.value?.sellerId === auth.user?.id);
const canOrder = computed(() => product.value?.status === 'on_sale' && !isOwner.value);

async function fetchDetail() {
  loading.value = true;
  try {
    product.value = await getProductDetailApi(Number(route.params.id));
  } finally {
    loading.value = false;
  }
}

async function toggleFavorite() {
  if (!auth.user || !product.value) return;
  const next = product.value.favorited
    ? await unfavoriteProductApi(product.value.id, auth.user.id)
    : await favoriteProductApi(product.value.id, auth.user.id);
  product.value = next;
  ElMessage.success(next.favorited ? '已加入收藏' : '已取消收藏');
}

async function submitOrder() {
  if (!product.value || !auth.user) return;
  await formRef.value?.validate();
  orderLoading.value = true;
  try {
    const order = await createOrderApi({ productId: product.value.id, ...orderForm }, auth.user.id);
    ElMessage.success('订单已提交，等待卖家确认');
    dialogVisible.value = false;
    router.push(`/orders/${order.id}`);
  } finally {
    orderLoading.value = false;
  }
}

onMounted(fetchDetail);
</script>

<template>
  <section class="page-shell detail-page" v-loading="loading">
    <EmptyState v-if="!loading && !product" title="商品不存在" description="该商品可能已被删除。" />

    <template v-if="product">
      <div class="detail-grid">
        <div class="gallery soft-card">
          <el-carousel height="420px" indicator-position="outside">
            <el-carousel-item v-for="image in product.images" :key="image">
              <img :src="image" :alt="product.title" class="image-cover" />
            </el-carousel-item>
          </el-carousel>
        </div>

        <aside class="info soft-card">
          <div class="title-line">
            <h1>{{ product.title }}</h1>
            <StatusTag :value="product.status" />
          </div>
          <div class="price">{{ money(product.price) }}</div>
          <div class="meta-list">
            <div><span>分类</span><strong>{{ product.category }}</strong></div>
            <div><span>成色</span><strong>{{ product.condition }}</strong></div>
            <div><span>地点</span><strong>{{ product.location }}</strong></div>
            <div><span>发布时间</span><strong>{{ shortDate(product.createdAt) }}</strong></div>
          </div>
          <div class="stats">
            <span><el-icon><View /></el-icon>{{ product.viewCount }} 次浏览</span>
            <span><el-icon><Star /></el-icon>{{ product.favoriteCount }} 人收藏</span>
          </div>
          <div class="action-row">
            <el-button size="large" :icon="product.favorited ? StarFilled : Star" @click="toggleFavorite">
              {{ product.favorited ? '取消收藏' : '收藏商品' }}
            </el-button>
            <el-button type="primary" size="large" :icon="Tickets" :disabled="!canOrder" @click="dialogVisible = true">立即下单</el-button>
          </div>
          <el-alert v-if="isOwner" title="这是你发布的商品，不能对自己的商品下单。" type="info" show-icon :closable="false" />
          <el-alert v-else-if="product.status !== 'on_sale'" title="该商品当前不可下单。" type="warning" show-icon :closable="false" />
        </aside>
      </div>

      <div class="content-grid">
        <article class="soft-card description">
          <h2>商品描述</h2>
          <p>{{ product.description }}</p>
        </article>
        <aside class="side-panel">
          <div class="soft-card seller">
            <h3>卖家信息</h3>
            <strong>{{ product.sellerName }}</strong>
            <p><el-icon><ChatLineRound /></el-icon>{{ product.contact || '下单后交换联系方式' }}</p>
            <p><el-icon><Location /></el-icon>{{ product.location }}</p>
          </div>
          <div class="soft-card tips">
            <h3>交易提示</h3>
            <ul>
              <li>建议在校园公共区域当面验货。</li>
              <li>订单确认后再进行线下交付。</li>
              <li>如有争议，可将订单标记为异常。</li>
            </ul>
          </div>
        </aside>
      </div>
    </template>

    <el-dialog v-model="dialogVisible" title="确认订单" width="460px">
      <el-form ref="formRef" :model="orderForm" :rules="rules" label-width="90px">
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="orderForm.contact" placeholder="手机号 / 微信 / QQ" />
        </el-form-item>
        <el-form-item label="交易备注">
          <el-input v-model="orderForm.remark" type="textarea" :rows="3" placeholder="例如：今晚 7 点图书馆门口交易" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="orderLoading" @click="submitOrder">提交订单</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
.detail-page {
  padding-top: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 20px;
}

.gallery {
  overflow: hidden;
  padding: 14px;
}

.info {
  padding: 22px;
}

.title-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  h1 {
    margin: 0;
    font-size: 24px;
    line-height: 1.35;
  }
}

.price {
  margin: 18px 0;
  font-size: 32px;
}

.meta-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  div {
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;

    span,
    strong {
      display: block;
    }

    span {
      color: var(--cm-muted);
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
}

.stats,
.action-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}

.stats span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--cm-muted);
}

.action-row .el-button {
  flex: 1;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 20px;
  margin-top: 20px;
}

.description,
.seller,
.tips {
  padding: 22px;

  h2,
  h3 {
    margin: 0 0 12px;
  }

  p,
  li {
    color: #475569;
    line-height: 1.8;
  }
}

.seller p {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
}

.side-panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

@media (max-width: 900px) {
  .detail-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
