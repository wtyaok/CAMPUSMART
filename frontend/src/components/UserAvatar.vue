<script setup lang="ts">
import type { User } from '@/types';

defineProps<{
  user?: User | null;
  size?: number;
}>();
</script>

<template>
  <el-avatar :size="size || 34" :src="user?.avatar">
    {{ user?.nickname?.slice(0, 1) || 'U' }}
  </el-avatar>
</template>
