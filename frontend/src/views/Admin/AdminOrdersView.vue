<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getAdminOrdersApi, handleAdminOrderApi } from '@/api/admin';
import { money, shortDate } from '@/utils/format';
import { orderStatusMap } from '@/utils/constants';
import type { Order, OrderQuery } from '@/types';

const loading = ref(false);
const orders = ref<Order[]>([]);
const total = ref(0);
const query = reactive<OrderQuery>({
  status: '',
  page: 1,
  pageSize: 8
});

async function fetchOrders() {
  loading.value = true;
  try {
    const result = await getAdminOrdersApi(query);
    orders.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

watch(() => query.status, () => {
  query.page = 1;
  fetchOrders();
});

async function handle(row: Order, status: 'completed' | 'cancelled') {
  const { value } = await ElMessageBox.prompt('请输入处理备注', status === 'completed' ? '处理为完成' : '处理为取消', {
    confirmButtonText: '确认处理',
    cancelButtonText: '取消',
    inputPattern: /^.{2,120}$/,
    inputErrorMessage: '处理备注需 2-120 个字符'
  });
  await handleAdminOrderApi(row.id, status, value);
  ElMessage.success('异常订单已处理');
  fetchOrders();
}

onMounted(fetchOrders);
</script>

<template>
  <section class="admin-page">
    <PageHeader title="订单管理" subtitle="查看订单列表并处理异常订单" />
    <div class="soft-card toolbar">
      <el-select v-model="query.status" placeholder="订单状态" clearable>
        <el-option v-for="(meta, key) in orderStatusMap" :key="key" :label="meta.label" :value="key" />
      </el-select>
    </div>
    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !orders.length" title="暂无订单" />
      <el-table v-else :data="orders" row-key="id">
        <el-table-column prop="orderNo" label="订单编号" width="160" />
        <el-table-column label="商品" min-width="250">
          <template #default="{ row }">
            <div class="order-product">
              <img :src="row.productImage" :alt="row.productTitle" />
              <div><strong>{{ row.productTitle }}</strong><span>{{ money(row.price) }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="buyerName" label="买家" width="110" />
        <el-table-column prop="sellerName" label="卖家" width="110" />
        <el-table-column label="状态" width="140"><template #default="{ row }"><StatusTag :value="row.status" kind="order" /></template></el-table-column>
        <el-table-column label="创建时间" width="170"><template #default="{ row }">{{ shortDate(row.createdAt) }}</template></el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/orders/${row.id}`)">详情</el-button>
            <template v-if="row.status === 'abnormal'">
              <el-button text type="success" @click="handle(row, 'completed')">处理完成</el-button>
              <el-button text type="warning" @click="handle(row, 'cancelled')">处理取消</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" background layout="prev, pager, next, total" :total="total" @change="fetchOrders" />
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

  span {
    display: block;
    margin-top: 4px;
    color: var(--cm-red);
    font-weight: 700;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
