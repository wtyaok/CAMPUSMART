<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getMessagesApi } from '@/api/message';
import { shortDate } from '@/utils/format';
import type { Message } from '@/types';

const loading = ref(false);
const messages = ref<Message[]>([]);
const filter = ref('');

const filtered = computed(() => messages.value.filter((item) => (filter.value ? item.type === filter.value : true)));

async function fetchMessages() {
  loading.value = true;
  try {
    messages.value = await getMessagesApi(1);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchMessages);
</script>

<template>
  <section class="admin-page">
    <PageHeader title="消息管理" subtitle="查看管理员账号收到的系统和异常订单通知" />
    <div class="soft-card toolbar">
      <el-select v-model="filter" placeholder="消息类型" clearable>
        <el-option label="审核通知" value="review" />
        <el-option label="订单通知" value="order" />
        <el-option label="系统通知" value="system" />
        <el-option label="异常通知" value="abnormal" />
      </el-select>
    </div>
    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !filtered.length" title="暂无消息" />
      <el-table v-else :data="filtered" row-key="id">
        <el-table-column prop="title" label="标题" min-width="180" />
        <el-table-column prop="content" label="内容" min-width="320" />
        <el-table-column label="类型" width="120"><template #default="{ row }"><StatusTag :value="row.type" kind="message" /></template></el-table-column>
        <el-table-column label="已读" width="90"><template #default="{ row }">{{ row.read ? '是' : '否' }}</template></el-table-column>
        <el-table-column label="时间" width="170"><template #default="{ row }">{{ shortDate(row.createdAt) }}</template></el-table-column>
      </el-table>
    </div>
  </section>
</template>
