import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login/LoginView.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      component: () => import('@/layouts/UserLayout.vue'),
      redirect: '/home',
      children: [
        { path: 'home', name: 'home', component: () => import('@/views/Home/HomeView.vue') },
        { path: 'products', name: 'products', component: () => import('@/views/Product/ProductListView.vue') },
        { path: 'products/new', name: 'product-new', component: () => import('@/views/Product/ProductFormView.vue') },
        { path: 'products/:id', name: 'product-detail', component: () => import('@/views/Product/ProductDetailView.vue') },
        { path: 'products/:id/edit', name: 'product-edit', component: () => import('@/views/Product/ProductFormView.vue') },
        { path: 'orders', name: 'orders', component: () => import('@/views/Order/OrderListView.vue') },
        { path: 'orders/:id', name: 'order-detail', component: () => import('@/views/Order/OrderDetailView.vue') },
        { path: 'favorites', name: 'favorites', component: () => import('@/views/Favorite/FavoriteView.vue') },
        { path: 'messages', name: 'messages', component: () => import('@/views/Message/MessageView.vue') },
        { path: 'user/products', name: 'my-products', component: () => import('@/views/UserCenter/MyProductsView.vue') },
        { path: 'user/profile', name: 'profile', component: () => import('@/views/UserCenter/ProfileView.vue') }
      ]
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      redirect: '/admin/dashboard',
      meta: { admin: true },
      children: [
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/Admin/AdminDashboardView.vue') },
        { path: 'review', name: 'admin-review', component: () => import('@/views/Admin/AdminReviewView.vue') },
        { path: 'products', name: 'admin-products', component: () => import('@/views/Admin/AdminProductsView.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/views/Admin/AdminUsersView.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('@/views/Admin/AdminOrdersView.vue') },
        { path: 'messages', name: 'admin-messages', component: () => import('@/views/Admin/AdminMessagesView.vue') }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/home'
    }
  ],
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isLogin) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  if (to.meta.admin && !auth.isAdmin) {
    return { path: '/home' };
  }
  if (to.path === '/login' && auth.isLogin) {
    return auth.isAdmin ? '/admin/dashboard' : '/home';
  }
  return true;
});

export default router;
