<script setup lang="ts">
import { Star, StarFilled, View } from '@element-plus/icons-vue';
import StatusTag from './StatusTag.vue';
import { money, shortDate } from '@/utils/format';
import type { Product } from '@/types';

defineProps<{
  product: Product;
}>();

const emit = defineEmits<{
  favorite: [product: Product];
}>();
</script>

<template>
  <article class="product-card" @click="$router.push(`/products/${product.id}`)">
    <div class="cover">
      <img :src="product.images[0]" :alt="product.title" class="image-cover" />
      <StatusTag v-if="product.status !== 'on_sale'" class="status" :value="product.status" />
      <button class="favorite" type="button" @click.stop="emit('favorite', product)">
        <el-icon :class="{ active: product.favorited }">
          <StarFilled v-if="product.favorited" />
          <Star v-else />
        </el-icon>
      </button>
    </div>
    <div class="body">
      <h3>{{ product.title }}</h3>
      <div class="price-line">
        <span class="price">{{ money(product.price) }}</span>
        <el-tag size="small" effect="plain">{{ product.condition }}</el-tag>
      </div>
      <div class="meta">
        <span>{{ product.category }}</span>
        <span>{{ product.location }}</span>
      </div>
      <div class="bottom">
        <span>{{ product.sellerName }}</span>
        <span><el-icon><View /></el-icon>{{ product.viewCount }}</span>
      </div>
      <div class="time">{{ shortDate(product.createdAt) }}</div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.product-card {
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: #c8d5ea;
    box-shadow: var(--cm-shadow);
  }
}

.cover {
  position: relative;
  height: 178px;
  background: #e9eef6;

  .status {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  .favorite {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.92);
    color: #64748b;
    cursor: pointer;

    .active {
      color: #f59e0b;
    }
  }
}

.body {
  padding: 13px;

  h3 {
    height: 44px;
    margin: 0;
    font-size: 15px;
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

.price-line,
.meta,
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.price-line {
  margin: 12px 0 8px;
}

.meta,
.bottom,
.time {
  color: var(--cm-muted);
  font-size: 12px;
}

.bottom {
  margin-top: 10px;

  span:last-child {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
}

.time {
  margin-top: 6px;
}
</style>
