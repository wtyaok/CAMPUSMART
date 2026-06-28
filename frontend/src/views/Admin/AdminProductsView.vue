<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import SearchBar from '@/components/SearchBar.vue';
import { adminOffShelfProductApi, getAdminProductsApi } from '@/api/admin';
import { categories, productStatusMap } from '@/utils/constants';
import { money, shortDate } from '@/utils/format';
import type { Product, ProductQuery, ProductStatus } from '@/types';

const loading = ref(false);
const products = ref<Product[]>([]);
const total = ref(0);
const query = reactive<ProductQuery>({
  keyword: '',
  category: '',
  status: '',
  page: 1,
  pageSize: 8
});

async function fetchProducts() {
  loading.value = true;
  try {
    const result = await getAdminProductsApi(query);
    products.value = result.list;
    total.value = result.total;
  } finally {
    loading.value = false;
  }
}

watch(() => [query.category, query.status], () => {
  query.page = 1;
  fetchProducts();
});

async function offShelf(product: Product) {
  const { value } = await ElMessageBox.prompt('请输入下架原因', '违规下架', {
    confirmButtonText: '确认下架',
    cancelButtonText: '取消',
    inputPattern: /^.{2,100}$/,
    inputErrorMessage: '原因需 2-100 个字符'
  });
  await adminOffShelfProductApi(product.id, value);
  ElMessage.success('商品已下架并通知用户');
  fetchProducts();
}

onMounted(fetchProducts);
</script>

<template>
  <section class="admin-page">
    <PageHeader title="商品管理" subtitle="查看全部商品并处理违规内容" />
    <div class="soft-card toolbar">
      <SearchBar v-model="query.keyword" class="keyword" @search="fetchProducts" />
      <el-select v-model="query.category" placeholder="分类" clearable>
        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="query.status" placeholder="状态" clearable>
        <el-option v-for="(meta, key) in productStatusMap" :key="key" :label="meta.label" :value="key as ProductStatus" />
      </el-select>
    </div>
    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !products.length" title="暂无商品" />
      <el-table v-else :data="products" row-key="id">
        <el-table-column label="商品" min-width="280">
          <template #default="{ row }">
            <div class="product-cell">
              <img :src="row.images[0]" :alt="row.title" />
              <div><strong>{{ row.title }}</strong><span>{{ row.category }} · {{ row.sellerName }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="110"><template #default="{ row }">{{ money(row.price) }}</template></el-table-column>
        <el-table-column label="状态" width="120"><template #default="{ row }"><StatusTag :value="row.status" /></template></el-table-column>
        <el-table-column prop="viewCount" label="浏览" width="90" />
        <el-table-column prop="favoriteCount" label="收藏" width="90" />
        <el-table-column label="发布时间" width="170"><template #default="{ row }">{{ shortDate(row.createdAt) }}</template></el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="$router.push(`/products/${row.id}`)">详情</el-button>
            <el-button v-if="!['sold', 'off_shelf'].includes(row.status)" text type="danger" @click="offShelf(row)">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="query.page" v-model:page-size="query.pageSize" background layout="prev, pager, next, total" :total="total" @change="fetchProducts" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.keyword {
  min-width: 300px;
  flex: 1;
}

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

  span {
    display: block;
    color: var(--cm-muted);
    margin-top: 4px;
    font-size: 12px;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
