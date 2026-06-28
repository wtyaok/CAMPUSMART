<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import OrderTimeline from '@/components/OrderTimeline.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getOrderDetailApi, updateOrderStatusApi } from '@/api/order';
import { money, shortDate } from '@/utils/format';
import { useAuthStore } from '@/stores/auth';
import type { Order, OrderStatus } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const order = ref<Order | null>(null);

const isSeller = computed(() => order.value?.sellerId === auth.user?.id);
const canConfirm = computed(() => isSeller.value && order.value?.status === 'pending_confirm');
const canCancel = computed(() => order.value?.status === 'pending_confirm');
const canComplete = computed(() => order.value && ['confirmed', 'abnormal'].includes(order.value.status));
const canAbnormal = computed(() => order.value && ['pending_confirm', 'confirmed'].includes(order.value.status));

async function fetchOrder() {
  if (!auth.user) return;
  loading.value = true;
  try {
    order.value = await getOrderDetailApi(Number(route.params.id), auth.user.id);
  } finally {
    loading.value = false;
  }
}

async function changeStatus(status: OrderStatus) {
  if (!auth.user || !order.value) return;
  order.value = await updateOrderStatusApi(order.value.id, status, auth.user.id);
  ElMessage.success('订单状态已更新');
}

onMounted(fetchOrder);
</script>

<template>
  <section class="page-shell order-detail-page" v-loading="loading">
    <PageHeader title="订单详情" subtitle="订单信息、交易双方和状态时间线">
      <el-button @click="router.push('/orders')">返回订单</el-button>
    </PageHeader>

    <EmptyState v-if="!loading && !order" title="订单不存在" />

    <template v-if="order">
      <div class="soft-card order-summary">
        <div>
          <span>订单编号</span>
          <strong>{{ order.orderNo }}</strong>
        </div>
        <div>
          <span>订单状态</span>
          <StatusTag :value="order.status" kind="order" />
        </div>
        <div>
          <span>金额</span>
          <strong class="price">{{ money(order.price) }}</strong>
        </div>
        <div>
          <span>创建时间</span>
          <strong>{{ shortDate(order.createdAt) }}</strong>
        </div>
      </div>

      <div class="detail-grid">
        <section class="soft-card detail-card">
          <h2>商品信息</h2>
          <div class="product-line">
            <img :src="order.productImage" :alt="order.productTitle" />
            <div>
              <strong>{{ order.productTitle }}</strong>
              <p>{{ money(order.price) }}</p>
            </div>
          </div>
          <el-divider />
          <h2>交易信息</h2>
          <div class="info-grid">
            <div><span>买家</span><strong>{{ order.buyerName }}</strong></div>
            <div><span>卖家</span><strong>{{ order.sellerName }}</strong></div>
            <div><span>联系方式</span><strong>{{ order.contact }}</strong></div>
            <div><span>交易备注</span><strong>{{ order.remark || '-' }}</strong></div>
          </div>
          <div class="actions">
            <el-button v-if="canConfirm" type="success" @click="changeStatus('confirmed')">卖家确认</el-button>
            <el-button v-if="canComplete" type="primary" @click="changeStatus('completed')">确认完成</el-button>
            <el-button v-if="canCancel" type="warning" @click="changeStatus('cancelled')">取消订单</el-button>
            <el-button v-if="canAbnormal" type="danger" @click="changeStatus('abnormal')">标记异常</el-button>
          </div>
        </section>

        <aside class="soft-card detail-card">
          <h2>状态时间线</h2>
          <OrderTimeline :timeline="order.timeline" />
        </aside>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.order-detail-page {
  padding-top: 4px;
}

.order-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  padding: 18px;
  margin-bottom: 18px;

  span,
  strong {
    display: block;
  }

  span {
    color: var(--cm-muted);
    margin-bottom: 6px;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
}

.detail-card {
  padding: 22px;

  h2 {
    margin: 0 0 16px;
  }
}

.product-line {
  display: flex;
  align-items: center;
  gap: 14px;

  img {
    width: 110px;
    height: 82px;
    object-fit: cover;
    border-radius: 8px;
  }

  p {
    color: var(--cm-red);
    font-weight: 800;
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  div {
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: var(--cm-muted);
    font-size: 13px;
    margin-bottom: 4px;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

@media (max-width: 900px) {
  .order-summary,
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
