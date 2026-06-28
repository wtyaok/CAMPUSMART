<script setup lang="ts">
import { computed } from 'vue';
import { messageTypeMap, orderStatusMap, productStatusMap } from '@/utils/constants';
import type { MessageType, OrderStatus, ProductStatus } from '@/types';

const props = defineProps<{
  value: ProductStatus | OrderStatus | MessageType | 'normal' | 'disabled';
  kind?: 'product' | 'order' | 'message' | 'user';
}>();

const meta = computed(() => {
  if (props.kind === 'order') return orderStatusMap[props.value as OrderStatus];
  if (props.kind === 'message') return messageTypeMap[props.value as MessageType];
  if (props.kind === 'user') {
    return props.value === 'normal' ? { label: '正常', type: 'success' as const } : { label: '已禁用', type: 'danger' as const };
  }
  return productStatusMap[props.value as ProductStatus];
});
</script>

<template>
  <el-tag :type="meta.type" effect="light" round>{{ meta.label }}</el-tag>
</template>
