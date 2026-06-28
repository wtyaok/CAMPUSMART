<script setup lang="ts">
import { onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useMessageStore } from '@/stores/message';
import { shortDate } from '@/utils/format';

const store = useMessageStore();

async function read(id: number) {
  await store.read(id);
  ElMessage.success('已标记为已读');
}

async function readAll() {
  await store.readAll();
  ElMessage.success('全部消息已读');
}

async function remove(id: number) {
  await store.remove(id);
  ElMessage.success('消息已删除');
}

onMounted(store.fetchMessages);
</script>

<template>
  <section class="page-shell">
    <PageHeader title="消息通知" :subtitle="`未读消息 ${store.unreadCount} 条`">
      <el-button @click="readAll" :disabled="!store.unreadCount">全部已读</el-button>
    </PageHeader>

    <div class="soft-card message-list" v-loading="store.loading">
      <EmptyState v-if="!store.loading && !store.list.length" title="暂无消息" description="审核、订单和系统通知会在这里汇总。" />
      <article v-for="item in store.list" v-else :key="item.id" class="message-item" :class="{ unread: !item.read }">
        <div class="dot" />
        <div class="content">
          <div class="line">
            <h3>{{ item.title }}</h3>
            <StatusTag :value="item.type" kind="message" />
          </div>
          <p>{{ item.content }}</p>
          <span>{{ shortDate(item.createdAt) }}</span>
        </div>
        <div class="actions">
          <el-button v-if="!item.read" text type="primary" @click="read(item.id)">标记已读</el-button>
          <el-button text type="danger" @click="remove(item.id)">删除</el-button>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
.message-list {
  padding: 8px;
}

.message-item {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  gap: 14px;
  align-items: start;
  padding: 16px;
  border-bottom: 1px solid var(--cm-border);

  &:last-child {
    border-bottom: 0;
  }

  &.unread {
    background: #f7fbff;
  }
}

.dot {
  width: 8px;
  height: 8px;
  margin-top: 8px;
  border-radius: 50%;
  background: #cbd5e1;
}

.unread .dot {
  background: var(--cm-primary);
}

.line {
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    margin: 0;
    font-size: 16px;
  }
}

.content {
  p {
    margin: 8px 0;
    color: #475569;
  }

  span {
    color: var(--cm-muted);
    font-size: 13px;
  }
}

.actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 640px) {
  .message-item {
    grid-template-columns: 10px 1fr;
  }

  .actions {
    grid-column: 2;
  }
}
</style>
