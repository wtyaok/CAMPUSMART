<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue';
import UserAvatar from '@/components/UserAvatar.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useAuthStore } from '@/stores/auth';
import { shortDate } from '@/utils/format';

const auth = useAuthStore();
</script>

<template>
  <section class="page-shell">
    <PageHeader title="个人中心" subtitle="查看账号信息和当前状态" />
    <div class="soft-card profile-card">
      <UserAvatar :user="auth.user" :size="72" />
      <div class="profile-info">
        <h2>{{ auth.user?.nickname }}</h2>
        <p>@{{ auth.user?.username }}</p>
        <div class="profile-grid">
          <div><span>角色</span><strong>{{ auth.user?.role === 'admin' ? '管理员' : '普通用户' }}</strong></div>
          <div><span>手机号</span><strong>{{ auth.user?.phone || '-' }}</strong></div>
          <div><span>账号状态</span><StatusTag v-if="auth.user" :value="auth.user.status" kind="user" /></div>
          <div><span>注册时间</span><strong>{{ shortDate(auth.user?.createdAt || '') }}</strong></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-card {
  display: flex;
  gap: 20px;
  padding: 26px;
}

.profile-info {
  flex: 1;

  h2 {
    margin: 0;
  }

  p {
    margin: 6px 0 18px;
    color: var(--cm-muted);
  }
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  div {
    padding: 14px;
    background: #f8fafc;
    border-radius: 8px;
  }

  span,
  strong {
    display: block;
  }

  span {
    color: var(--cm-muted);
    font-size: 13px;
    margin-bottom: 6px;
  }
}
</style>
