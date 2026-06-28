<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { deleteProductApi, myProductsApi, offShelfMyProductApi } from '@/api/product';
import { money, shortDate } from '@/utils/format';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/types';

const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const products = ref<Product[]>([]);

async function fetchProducts() {
  if (!auth.user) return;
  loading.value = true;
  try {
    products.value = await myProductsApi(auth.user.id);
  } finally {
    loading.value = false;
  }
}

async function offShelf(product: Product) {
  if (!auth.user) return;
  await ElMessageBox.confirm(`确认下架「${product.title}」？`, '下架商品', { type: 'warning' });
  await offShelfMyProductApi(product.id, auth.user.id);
  ElMessage.success('商品已下架');
  fetchProducts();
}

async function remove(product: Product) {
  if (!auth.user) return;
  await ElMessageBox.confirm(`确认删除「${product.title}」？`, '删除商品', { type: 'warning' });
  await deleteProductApi(product.id, auth.user.id);
  ElMessage.success('商品已删除');
  fetchProducts();
}

onMounted(fetchProducts);
</script>

<template>
  <section class="page-shell">
    <PageHeader title="我的发布" subtitle="查看自己发布的商品、审核状态和交易数据">
      <el-button type="primary" @click="router.push('/products/new')">发布商品</el-button>
    </PageHeader>

    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !products.length" title="还没有发布商品" description="把闲置物品发布出来，等待管理员审核后即可展示。">
        <el-button type="primary" @click="router.push('/products/new')">去发布</el-button>
      </EmptyState>
      <el-table v-else :data="products" row-key="id">
        <el-table-column label="商品" min-width="260">
          <template #default="{ row }">
            <div class="product-cell">
              <img :src="row.images[0]" :alt="row.title" />
              <div>
                <strong>{{ row.title }}</strong>
                <span>{{ row.category }} · {{ row.condition }}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="110">
          <template #default="{ row }">{{ money(row.price) }}</template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }"><StatusTag :value="row.status" /></template>
        </el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="90" />
        <el-table-column prop="favoriteCount" label="收藏" width="90" />
        <el-table-column label="发布时间" width="170">
          <template #default="{ row }">{{ shortDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="router.push(`/products/${row.id}`)">详情</el-button>
            <el-button v-if="['pending_review', 'on_sale', 'rejected'].includes(row.status)" text @click="router.push(`/products/${row.id}/edit`)">编辑</el-button>
            <el-button v-if="['pending_review', 'on_sale'].includes(row.status)" text type="warning" @click="offShelf(row)">下架</el-button>
            <el-button v-if="['pending_review', 'rejected', 'off_shelf'].includes(row.status)" text type="danger" @click="remove(row)">删除</el-button>
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
    margin-top: 4px;
    color: var(--cm-muted);
    font-size: 12px;
  }
}
</style>
