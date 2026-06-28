<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import ProductCard from '@/components/ProductCard.vue';
import SearchBar from '@/components/SearchBar.vue';
import { favoriteProductApi, getProductsApi, unfavoriteProductApi } from '@/api/product';
import { categories, productStatusMap } from '@/utils/constants';
import { debounce } from '@/utils/format';
import { useAuthStore } from '@/stores/auth';
import type { Product, ProductQuery, ProductStatus } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const loading = ref(false);
const products = ref<Product[]>([]);
const total = ref(0);

const query = reactive<ProductQuery>({
  keyword: String(route.query.keyword || ''),
  category: String(route.query.category || ''),
  status: 'on_sale',
  minPrice: undefined,
  maxPrice: undefined,
  sort: 'latest',
  page: 1,
  pageSize: 8
});

async function fetchProducts() {
  loading.value = true;
  try {
    const result = await getProductsApi(query);
    products.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

const debouncedFetch = debounce(() => {
  query.page = 1;
  fetchProducts();
}, 360);

watch(
  () => [query.keyword, query.category, query.status, query.minPrice, query.maxPrice, query.sort],
  () => debouncedFetch()
);

watch(
  () => route.query,
  () => {
    query.keyword = String(route.query.keyword || '');
    query.category = String(route.query.category || '');
    query.page = 1;
    fetchProducts();
  }
);

async function toggleFavorite(product: Product) {
  if (!auth.user) return;
  const next = product.favorited ? await unfavoriteProductApi(product.id, auth.user.id) : await favoriteProductApi(product.id, auth.user.id);
  Object.assign(product, next);
  ElMessage.success(next.favorited ? '已收藏' : '已取消收藏');
}

onMounted(fetchProducts);
</script>

<template>
  <section class="page-shell product-list-page">
    <PageHeader title="商品列表" subtitle="搜索、筛选和排序校园二手商品">
      <el-button type="primary" @click="router.push('/products/new')">发布商品</el-button>
    </PageHeader>

    <div class="soft-card toolbar">
      <SearchBar v-model="query.keyword" class="keyword" placeholder="搜索标题、描述、卖家" @search="fetchProducts" />
      <el-select v-model="query.category" placeholder="分类" clearable>
        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input-number v-model="query.minPrice" :min="0" :precision="0" placeholder="最低价" />
      <el-input-number v-model="query.maxPrice" :min="0" :precision="0" placeholder="最高价" />
      <el-select v-model="query.status" placeholder="状态" clearable>
        <el-option label="出售中" value="on_sale" />
        <el-option
          v-for="(meta, key) in productStatusMap"
          :key="key"
          :label="meta.label"
          :value="key as ProductStatus"
        />
      </el-select>
      <el-select v-model="query.sort" placeholder="排序">
        <el-option label="最新发布" value="latest" />
        <el-option label="价格从低到高" value="priceAsc" />
        <el-option label="价格从高到低" value="priceDesc" />
      </el-select>
    </div>

    <div v-loading="loading" class="list-area">
      <el-skeleton v-if="loading && !products.length" :rows="8" animated />
      <EmptyState v-else-if="!products.length" title="没有找到商品" description="可以调整关键词、分类或价格区间再试试。" />
      <div v-else class="grid-products">
        <ProductCard v-for="product in products" :key="product.id" :product="product" @favorite="toggleFavorite" />
      </div>
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        background
        layout="prev, pager, next, sizes, total"
        :page-sizes="[8, 12, 16]"
        :total="total"
        @change="fetchProducts"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.product-list-page {
  padding-top: 4px;
}

.keyword {
  min-width: min(100%, 320px);
  flex: 1;
}

.list-area {
  min-height: 320px;
  margin-top: 18px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 22px;
}
</style>
