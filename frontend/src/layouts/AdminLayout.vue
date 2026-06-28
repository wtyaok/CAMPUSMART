<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Bell, DataBoard, Goods, House, List, Tickets, UserFilled } from '@element-plus/icons-vue';
import UserAvatar from '@/components/UserAvatar.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const active = computed(() => route.path);

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="admin-brand">
        <span class="logo-mark">CM</span>
        <div>
          <strong>CampusMart</strong>
          <small>管理后台</small>
        </div>
      </div>
      <el-menu :default-active="active" router class="admin-menu">
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataBoard /></el-icon><span>工作台</span>
        </el-menu-item>
        <el-menu-item index="/admin/review">
          <el-icon><List /></el-icon><span>商品审核</span>
        </el-menu-item>
        <el-menu-item index="/admin/products">
          <el-icon><Goods /></el-icon><span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><UserFilled /></el-icon><span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><Tickets /></el-icon><span>订单管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/messages">
          <el-icon><Bell /></el-icon><span>消息管理</span>
        </el-menu-item>
      </el-menu>
    </aside>
    <section class="admin-main">
      <header class="admin-top">
        <el-button :icon="House" @click="router.push('/home')">返回前台</el-button>
        <div class="admin-user">
          <UserAvatar :user="auth.user" />
          <span>{{ auth.user?.nickname }}</span>
          <el-button text @click="logout">退出</el-button>
        </div>
      </header>
      <RouterView />
    </section>
  </div>
</template>

<style scoped lang="scss">
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 236px 1fr;
  background: #f4f6fa;
}

.sidebar {
  background: #101827;
  color: #fff;
}

.admin-brand {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .logo-mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    background: var(--cm-primary);
    border-radius: 8px;
    font-weight: 800;
  }

  strong,
  small {
    display: block;
  }

  small {
    color: #9ca3af;
    margin-top: 3px;
  }
}

.admin-menu {
  border-right: 0;
  background: transparent;

  :deep(.el-menu-item) {
    color: #cbd5e1;

    &.is-active,
    &:hover {
      color: #fff;
      background: rgba(37, 99, 235, 0.32);
    }
  }
}

.admin-main {
  min-width: 0;
}

.admin-top {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
  background: #fff;
  border-bottom: 1px solid var(--cm-border);
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 800px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .admin-menu {
    display: flex;
    overflow-x: auto;
  }
}
</style>
