<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { approveProductApi, getReviewProductsApi, rejectProductApi } from '@/api/admin';
import { money, shortDate } from '@/utils/format';
import type { Product } from '@/types';

const loading = ref(false);
const products = ref<Product[]>([]);

async function fetchProducts() {
  loading.value = true;
  try {
    products.value = await getReviewProductsApi();
  } finally {
    loading.value = false;
  }
}

async function approve(product: Product) {
  await approveProductApi(product.id);
  ElMessage.success('审核通过，商品已上架');
  fetchProducts();
}

async function reject(product: Product) {
  const { value } = await ElMessageBox.prompt('请输入拒绝原因', '审核拒绝', {
    confirmButtonText: '确认拒绝',
    cancelButtonText: '取消',
    inputPattern: /^.{2,100}$/,
    inputErrorMessage: '拒绝原因需 2-100 个字符'
  });
  await rejectProductApi(product.id, value);
  ElMessage.success('已拒绝并通知用户');
  fetchProducts();
}

onMounted(fetchProducts);
</script>

<template>
  <section class="admin-page">
    <PageHeader title="商品审核" subtitle="处理用户提交的待审核商品" />
    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !products.length" title="暂无待审核商品" />
      <el-table v-else :data="products" row-key="id">
        <el-table-column label="商品" min-width="280">
          <template #default="{ row }">
            <div class="product-cell">
              <img :src="row.images[0]" :alt="row.title" />
              <div><strong>{{ row.title }}</strong><span>{{ row.category }} · {{ row.condition }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="110">
          <template #default="{ row }">{{ money(row.price) }}</template>
        </el-table-column>
        <el-table-column prop="sellerName" label="发布者" width="120" />
        <el-table-column prop="location" label="地点" width="140" />
        <el-table-column label="状态" width="110">
          <template #default="{ row }"><StatusTag :value="row.status" /></template>
        </el-table-column>
        <el-table-column label="提交时间" width="170">
          <template #default="{ row }">{{ shortDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/products/${row.id}`)">详情</el-button>
            <el-button text type="success" @click="approve(row)">通过</el-button>
            <el-button text type="danger" @click="reject(row)">拒绝</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  img {
    width: 66px;
    height: 50px;
    object-fit: cover;
    border-radius: 6px;
  }

  strong,
  span {
    display: block;
  }

  span {
    color: var(--cm-muted);
    margin-top: 4px;
    font-size: 12px;
  }
}
</style>
