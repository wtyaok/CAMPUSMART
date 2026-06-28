<script setup lang="ts">
import { orderStatusMap } from '@/utils/constants';
import { shortDate } from '@/utils/format';
import type { OrderTimeline } from '@/types';

defineProps<{
  timeline: OrderTimeline[];
}>();
</script>

<template>
  <el-timeline>
    <el-timeline-item
      v-for="item in timeline"
      :key="`${item.status}-${item.time}`"
      :timestamp="shortDate(item.time)"
      :type="orderStatusMap[item.status]?.type || 'primary'"
    >
      <strong>{{ item.label }}</strong>
      <p v-if="item.note">{{ item.note }}</p>
    </el-timeline-item>
  </el-timeline>
</template>

<style scoped>
p {
  margin: 4px 0 0;
  color: var(--cm-muted);
}
</style>
