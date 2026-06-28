<script setup lang="ts">
import { Box } from '@element-plus/icons-vue';

defineProps<{
  title?: string;
  description?: string;
}>();
</script>

<template>
  <div class="empty-state">
    <el-icon :size="44"><Box /></el-icon>
    <h3>{{ title || '暂无数据' }}</h3>
    <p>{{ description || '换个筛选条件，或者稍后再来看看。' }}</p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  min-height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--cm-muted);
  text-align: center;

  h3 {
    margin: 6px 0 0;
    color: var(--cm-text);
  }

  p {
    margin: 0;
  }
}
</style>
