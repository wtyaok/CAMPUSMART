<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Bell, Box, Goods, House, Plus, Star, Tickets, User } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import UserAvatar from '@/components/UserAvatar.vue';
import { useAuthStore } from '@/stores/auth';
import { useMessageStore } from '@/stores/message';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const messageStore = useMessageStore();
const keyword = ref('');

const active = computed(() => route.path);

onMounted(() => {
  messageStore.fetchMessages();
});

function logout() {
  auth.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
}

function search() {
  router.push({ path: '/products', query: { keyword: keyword.value } });
}

function goPublish() {
  if (auth.user?.status === 'disabled') {
    ElMessage.warning('账号已被禁用，暂不能发布商品');
    return;
  }
  router.push('/products/new');
}
</script>

<template>
  <div class="user-layout">
    <header class="topbar">
      <div class="page-shell nav-inner">
        <RouterLink to="/home" class="brand">
          <span class="logo-mark">CM</span>
          <span>CampusMart</span>
        </RouterLink>
        <nav class="nav-links">
          <RouterLink to="/home" :class="{ active: active === '/home' }">
            <el-icon><House /></el-icon>首页
          </RouterLink>
          <RouterLink to="/products" :class="{ active: active.startsWith('/products') }">
            <el-icon><Goods /></el-icon>商品
          </RouterLink>
          <RouterLink to="/favorites" :class="{ active: active === '/favorites' }">
            <el-icon><Star /></el-icon>收藏
          </RouterLink>
          <RouterLink to="/orders" :class="{ active: active.startsWith('/orders') }">
            <el-icon><Tickets /></el-icon>订单
          </RouterLink>
        </nav>
        <el-input v-model="keyword" class="nav-search" placeholder="搜索二手好物" clearable @keyup.enter="search">
          <template #append>
            <el-button @click="search">搜索</el-button>
          </template>
        </el-input>
        <el-button type="primary" :icon="Plus" @click="goPublish">发布商品</el-button>
        <el-badge :value="messageStore.unreadCount" :hidden="!messageStore.unreadCount">
          <el-button :icon="Bell" circle @click="router.push('/messages')" />
        </el-badge>
        <el-dropdown trigger="click">
          <button class="avatar-btn">
            <UserAvatar :user="auth.user" />
          </button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/user/profile')">
                <el-icon><User /></el-icon>个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="router.push('/user/products')">
                <el-icon><Box /></el-icon>我的发布
              </el-dropdown-item>
              <el-dropdown-item v-if="auth.isAdmin" divided @click="router.push('/admin/dashboard')">进入后台</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.user-layout {
  min-height: 100vh;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid var(--cm-border);
  backdrop-filter: blur(12px);
}

.nav-inner {
  height: 66px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
}

.logo-mark {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #fff;
  background: var(--cm-primary);
  border-radius: 8px;
  font-size: 13px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;

  a {
    height: 36px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 10px;
    color: #475569;
    border-radius: 6px;

    &.active,
    &:hover {
      color: var(--cm-primary);
      background: #eef5ff;
    }
  }
}

.nav-search {
  flex: 1;
  min-width: 180px;
}

.avatar-btn {
  display: inline-flex;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

main {
  padding-bottom: 38px;
}

@media (max-width: 980px) {
  .nav-inner {
    height: auto;
    min-height: 66px;
    flex-wrap: wrap;
    padding: 10px 0;
  }

  .nav-search {
    order: 4;
    flex-basis: 100%;
  }
}

@media (max-width: 640px) {
  .nav-links {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
