<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getOrdersApi, updateOrderStatusApi } from '@/api/order';
import { money, shortDate } from '@/utils/format';
import { orderStatusMap } from '@/utils/constants';
import { useAuthStore } from '@/stores/auth';
import type { Order, OrderQuery, OrderStatus } from '@/types';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const total = ref(0);
const orders = ref<Order[]>([]);
const query = reactive<OrderQuery>({
  type: 'all',
  status: '',
  page: 1,
  pageSize: 8
});

async function fetchOrders() {
  if (!auth.user) return;
  loading.value = true;
  try {
    const result = await getOrdersApi(query, auth.user.id);
    orders.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

watch(() => [query.type, query.status], () => {
  query.page = 1;
  fetchOrders();
});

async function changeStatus(order: Order, status: OrderStatus) {
  if (!auth.user) return;
  await updateOrderStatusApi(order.id, status, auth.user.id);
  ElMessage.success('订单状态已更新');
  fetchOrders();
}

function canConfirm(order: Order) {
  return order.sellerId === auth.user?.id && order.status === 'pending_confirm';
}

function canCancel(order: Order) {
  return order.status === 'pending_confirm';
}

function canComplete(order: Order) {
  return ['confirmed', 'abnormal'].includes(order.status);
}

function canAbnormal(order: Order) {
  return ['pending_confirm', 'confirmed'].includes(order.status);
}

onMounted(fetchOrders);
</script>

<template>
  <section class="page-shell">
    <PageHeader title="我的订单" subtitle="查看买到的、卖出的订单，并按状态推进交易" />

    <div class="soft-card toolbar">
      <el-segmented v-model="query.type" :options="[
        { label: '全部', value: 'all' },
        { label: '我买到的', value: 'buy' },
        { label: '我卖出的', value: 'sell' }
      ]" />
      <el-select v-model="query.status" placeholder="订单状态" clearable>
        <el-option v-for="(meta, key) in orderStatusMap" :key="key" :label="meta.label" :value="key" />
      </el-select>
    </div>

    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !orders.length" title="暂无订单" description="下单或卖出商品后，订单会显示在这里。" />
      <el-table v-else :data="orders" row-key="id">
        <el-table-column prop="orderNo" label="订单编号" width="160" />
        <el-table-column label="商品信息" min-width="270">
          <template #default="{ row }">
            <div class="order-product">
              <img :src="row.productImage" :alt="row.productTitle" />
              <div>
                <strong>{{ row.productTitle }}</strong>
                <span>{{ money(row.price) }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="buyerName" label="买家" width="110" />
        <el-table-column prop="sellerName" label="卖家" width="110" />
        <el-table-column label="状态" width="140">
          <template #default="{ row }"><StatusTag :value="row.status" kind="order" /></template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ shortDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="330" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="router.push(`/orders/${row.id}`)">详情</el-button>
            <el-button v-if="canConfirm(row)" text type="success" @click="changeStatus(row, 'confirmed')">确认</el-button>
            <el-button v-if="canComplete(row)" text type="success" @click="changeStatus(row, 'completed')">完成</el-button>
            <el-button v-if="canCancel(row)" text type="warning" @click="changeStatus(row, 'cancelled')">取消</el-button>
            <el-button v-if="canAbnormal(row)" text type="danger" @click="changeStatus(row, 'abnormal')">异常</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="query.page"
          v-model:page-size="query.pageSize"
          background
          layout="prev, pager, next, total"
          :total="total"
          @change="fetchOrders"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.order-product {
  display: flex;
  gap: 12px;
  align-items: center;

  img {
    width: 64px;
    height: 48px;
    object-fit: cover;
    border-radius: 6px;
  }

  strong,
  span {
    display: block;
  }

  span {
    color: var(--cm-red);
    margin-top: 4px;
    font-weight: 700;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
