<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import ProductCard from '@/components/ProductCard.vue';
import { getFavoritesApi } from '@/api/favorite';
import { unfavoriteProductApi } from '@/api/product';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/types';

const auth = useAuthStore();
const loading = ref(false);
const products = ref<Product[]>([]);

async function fetchFavorites() {
  if (!auth.user) return;
  loading.value = true;
  try {
    products.value = await getFavoritesApi(auth.user.id);
  } finally {
    loading.value = false;
  }
}

async function cancel(product: Product) {
  if (!auth.user) return;
  await unfavoriteProductApi(product.id, auth.user.id);
  products.value = products.value.filter((item) => item.id !== product.id);
  ElMessage.success('已取消收藏');
}

onMounted(fetchFavorites);
</script>

<template>
  <section class="page-shell">
    <PageHeader title="我的收藏" subtitle="保存感兴趣的商品，失效商品会显示当前状态" />
    <div v-loading="loading">
      <el-skeleton v-if="loading && !products.length" :rows="8" animated />
      <EmptyState v-else-if="!products.length" title="还没有收藏商品" description="在商品卡片或详情页点击收藏后，会出现在这里。" />
      <div v-else class="grid-products">
        <ProductCard v-for="product in products" :key="product.id" :product="{ ...product, favorited: true }" @favorite="cancel" />
      </div>
    </div>
  </section>
</template>
