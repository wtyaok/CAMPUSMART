<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { Lock, User, Wallet } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const activeTab = ref<'login' | 'register'>('login');
const loading = ref(false);
const loginFormRef = ref<FormInstance>();
const registerFormRef = ref<FormInstance>();

const loginForm = reactive({
  username: 'user',
  password: 'user123'
});

const registerForm = reactive({
  username: '',
  nickname: '',
  phone: '',
  password: ''
});

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度 3-20 个字符', trigger: 'blur' }
  ],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
};

async function submitLogin() {
  await loginFormRef.value?.validate();
  loading.value = true;
  try {
    const user = await auth.login(loginForm);
    ElMessage.success(`欢迎回来，${user.nickname}`);
    const redirect = String(route.query.redirect || '');
    router.push(redirect || (user.role === 'admin' ? '/admin/dashboard' : '/home'));
  } finally {
    loading.value = false;
  }
}

async function submitRegister() {
  await registerFormRef.value?.validate();
  loading.value = true;
  try {
    await auth.register(registerForm);
    ElMessage.success('注册成功，请登录');
    activeTab.value = 'login';
    loginForm.username = registerForm.username;
    loginForm.password = registerForm.password;
  } finally {
    loading.value = false;
  }
}

function fill(username: string, password: string) {
  loginForm.username = username;
  loginForm.password = password;
  activeTab.value = 'login';
}
</script>

<template>
  <div class="login-page">
    <section class="intro">
      <div class="brand">
        <span>CM</span>
        <strong>CampusMart</strong>
      </div>
      <h1>校园二手交易与订单管理系统</h1>
      <p>发布闲置、浏览好物、线下自提、订单状态跟进，一套适合校园场景的轻量交易闭环。</p>
      <div class="selling-points">
        <div>低价闲置</div>
        <div>校园自提</div>
        <div>审核上架</div>
      </div>
    </section>

    <section class="login-card">
      <div class="card-title">
        <el-icon><Wallet /></el-icon>
        <div>
          <h2>账号登录</h2>
          <p>使用测试账号快速体验前台和后台流程</p>
        </div>
      </div>

      <el-tabs v-model="activeTab" stretch>
        <el-tab-pane label="登录" name="login">
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large" @keyup.enter="submitLogin">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" placeholder="密码" show-password :prefix-icon="Lock" />
            </el-form-item>
            <el-button type="primary" size="large" class="full" :loading="loading" @click="submitLogin">登录</el-button>
          </el-form>
          <div class="tips">
            <span>测试账号：</span>
            <button type="button" @click="fill('user', 'user123')">user / user123</button>
            <button type="button" @click="fill('admin', 'admin123')">admin / admin123</button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large" @keyup.enter="submitRegister">
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="用户名" :prefix-icon="User" />
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input v-model="registerForm.nickname" placeholder="昵称" />
            </el-form-item>
            <el-form-item prop="phone">
              <el-input v-model="registerForm.phone" placeholder="联系方式（选填）" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="registerForm.password" placeholder="密码" show-password :prefix-icon="Lock" />
            </el-form-item>
            <el-button type="primary" size="large" class="full" :loading="loading" @click="submitRegister">注册</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 430px;
  align-items: center;
  gap: 56px;
  padding: 48px min(8vw, 110px);
  background:
    linear-gradient(0deg, rgba(245, 247, 251, 0.92), rgba(245, 247, 251, 0.92)),
    url("https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1800&q=80") center/cover;
}

.intro {
  max-width: 650px;

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
    font-size: 20px;
    font-weight: 800;

    span {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      color: #fff;
      background: var(--cm-primary);
      border-radius: 8px;
      font-size: 15px;
    }
  }

  h1 {
    margin: 0;
    max-width: 620px;
    font-size: 46px;
    line-height: 1.15;
  }

  p {
    max-width: 560px;
    color: #475569;
    font-size: 17px;
    line-height: 1.9;
  }
}

.selling-points {
  display: flex;
  gap: 12px;
  margin-top: 26px;

  div {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid var(--cm-border);
    border-radius: 8px;
    font-weight: 700;
  }
}

.login-card {
  padding: 30px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid var(--cm-border);
  border-radius: 8px;
  box-shadow: var(--cm-shadow);
}

.card-title {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 14px;

  .el-icon {
    width: 44px;
    height: 44px;
    color: var(--cm-primary);
    background: #eef5ff;
    border-radius: 8px;
  }

  h2 {
    margin: 0;
    font-size: 22px;
  }

  p {
    margin: 4px 0 0;
    color: var(--cm-muted);
  }
}

.full {
  width: 100%;
}

.tips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: var(--cm-muted);
  font-size: 13px;

  button {
    padding: 5px 8px;
    color: var(--cm-primary);
    background: #eef5ff;
    border: 0;
    border-radius: 6px;
    cursor: pointer;
  }
}

@media (max-width: 900px) {
  .login-page {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 32px 20px;
  }

  .intro h1 {
    font-size: 34px;
  }
}
</style>
