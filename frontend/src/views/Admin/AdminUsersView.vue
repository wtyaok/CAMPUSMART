<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';
import SearchBar from '@/components/SearchBar.vue';
import StatusTag from '@/components/StatusTag.vue';
import { getAdminUsersApi, updateAdminUserStatusApi } from '@/api/admin';
import { shortDate } from '@/utils/format';
import type { User, UserStatus } from '@/types';

type UserRow = User & { productCount: number; orderCount: number };

const loading = ref(false);
const keyword = ref('');
const users = ref<UserRow[]>([]);

async function fetchUsers() {
  loading.value = true;
  try {
    users.value = await getAdminUsersApi(keyword.value);
  } finally {
    loading.value = false;
  }
}

async function setStatus(row: UserRow, status: UserStatus) {
  await updateAdminUserStatusApi(row.id, status);
  ElMessage.success(status === 'disabled' ? '用户已禁用' : '用户已启用');
  fetchUsers();
}

onMounted(fetchUsers);
</script>

<template>
  <section class="admin-page">
    <PageHeader title="用户管理" subtitle="搜索用户、查看发布和订单数量、启用或禁用账号" />
    <div class="soft-card toolbar">
      <SearchBar v-model="keyword" class="keyword" placeholder="搜索用户名或昵称" @search="fetchUsers" />
    </div>
    <div class="soft-card table-card" v-loading="loading">
      <EmptyState v-if="!loading && !users.length" title="暂无用户" />
      <el-table v-else :data="users" row-key="id">
        <el-table-column label="用户" min-width="220">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :src="row.avatar">{{ row.nickname.slice(0, 1) }}</el-avatar>
              <div><strong>{{ row.nickname }}</strong><span>@{{ row.username }}</span></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150" />
        <el-table-column label="状态" width="110"><template #default="{ row }"><StatusTag :value="row.status" kind="user" /></template></el-table-column>
        <el-table-column prop="productCount" label="发布数" width="100" />
        <el-table-column prop="orderCount" label="订单数" width="100" />
        <el-table-column label="注册时间" width="170"><template #default="{ row }">{{ shortDate(row.createdAt) }}</template></el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'normal'" text type="danger" @click="setStatus(row, 'disabled')">禁用</el-button>
            <el-button v-else text type="success" @click="setStatus(row, 'normal')">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<style scoped lang="scss">
.keyword {
  min-width: 320px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  strong,
  span {
    display: block;
  }

  span {
    color: var(--cm-muted);
    margin-top: 3px;
    font-size: 12px;
  }
}
</style>
