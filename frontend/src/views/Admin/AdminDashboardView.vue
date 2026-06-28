<script setup lang="ts">
import { onMounted, ref } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getDashboardApi } from '@/api/admin';
import { orderStatusMap } from '@/utils/constants';
import type { DashboardStats } from '@/types';

const loading = ref(false);
const stats = ref<DashboardStats | null>(null);

async function fetchDashboard() {
  loading.value = true;
  try {
    stats.value = await getDashboardApi();
  } finally {
    loading.value = false;
  }
}

onMounted(fetchDashboard);
</script>

<template>
  <section class="admin-page" v-loading="loading">
    <PageHeader title="管理工作台" subtitle="平台商品、用户和订单概览" />

    <div class="metric-grid" v-if="stats">
      <div class="metric-card"><span class="label">商品总数</span><strong class="value">{{ stats.productTotal }}</strong></div>
      <div class="metric-card"><span class="label">待审核商品</span><strong class="value">{{ stats.pendingProducts }}</strong></div>
      <div class="metric-card"><span class="label">用户总数</span><strong class="value">{{ stats.userTotal }}</strong></div>
      <div class="metric-card"><span class="label">订单总数</span><strong class="value">{{ stats.orderTotal }}</strong></div>
      <div class="metric-card"><span class="label">异常订单</span><strong class="value">{{ stats.abnormalOrders }}</strong></div>
    </div>

    <div class="dashboard-grid" v-if="stats">
      <section class="soft-card panel">
        <h2>最近 7 天发布数</h2>
        <div class="bar-list">
          <div v-for="item in stats.publishTrend" :key="item.date" class="bar-row">
            <span>{{ item.date }}</span>
            <div class="bar"><i :style="{ width: `${Math.max(8, item.count * 28)}px` }" /></div>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </section>
      <section class="soft-card panel">
        <h2>订单状态分布</h2>
        <div class="status-list">
          <div v-for="item in stats.orderStatus" :key="item.status">
            <StatusTag :value="item.status" kind="order" />
            <span>{{ orderStatusMap[item.status].label }}</span>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped lang="scss">
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 16px;
  margin-top: 18px;
}

.panel {
  padding: 20px;

  h2 {
    margin: 0 0 16px;
    font-size: 18px;
  }
}

.bar-list {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 54px 1fr 32px;
  align-items: center;
  gap: 10px;
  color: var(--cm-muted);
}

.bar {
  height: 12px;
  overflow: hidden;
  background: #edf2f7;
  border-radius: 999px;

  i {
    display: block;
    height: 100%;
    max-width: 100%;
    background: var(--cm-primary);
    border-radius: inherit;
  }
}

.status-list {
  display: grid;
  gap: 12px;

  div {
    display: grid;
    grid-template-columns: 92px 1fr auto;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #f8fafc;
    border-radius: 8px;
  }
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
