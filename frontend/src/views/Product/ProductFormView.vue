<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import ImageUploader from '@/components/ImageUploader.vue';
import PageHeader from '@/components/PageHeader.vue';
import { createProductApi, getProductDetailApi, updateProductApi } from '@/api/product';
import { campusLocations, categories } from '@/utils/constants';
import { useAuthStore } from '@/stores/auth';
import type { Product } from '@/types';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const formRef = ref<FormInstance>();
const loading = ref(false);
const submitting = ref(false);
const editProduct = ref<Product | null>(null);
const isEdit = computed(() => Boolean(route.params.id));

const form = reactive({
  title: '',
  category: '',
  price: 0,
  condition: '',
  location: '',
  contact: '',
  description: '',
  images: [] as string[]
});

const rules: FormRules = {
  title: [
    { required: true, message: '请输入商品标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度 2-50 个字符', trigger: 'blur' }
  ],
  category: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => (Number(value) > 0 ? callback() : callback(new Error('价格必须大于 0'))),
      trigger: 'blur'
    }
  ],
  condition: [{ required: true, message: '请选择成色', trigger: 'change' }],
  location: [{ required: true, message: '请选择交易地点', trigger: 'change' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入商品描述', trigger: 'blur' },
    { min: 10, message: '描述不少于 10 个字符', trigger: 'blur' }
  ],
  images: [
    {
      validator: (_rule, value: string[], callback) => {
        if (!value?.length) callback(new Error('至少添加 1 张图片'));
        else if (value.length > 5) callback(new Error('最多添加 5 张图片'));
        else callback();
      },
      trigger: 'change'
    }
  ]
};

async function loadEditProduct() {
  if (!isEdit.value) {
    form.contact = auth.user?.phone || '';
    return;
  }
  loading.value = true;
  try {
    const detail = await getProductDetailApi(Number(route.params.id));
    if (detail.sellerId !== auth.user?.id) {
      ElMessage.warning('只能编辑自己发布的商品');
      router.push('/user/products');
      return;
    }
    editProduct.value = detail;
    Object.assign(form, {
      title: detail.title,
      category: detail.category,
      price: detail.price,
      condition: detail.condition,
      location: detail.location,
      contact: detail.contact || auth.user?.phone || '',
      description: detail.description,
      images: [...detail.images]
    });
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!auth.user) return;
  await formRef.value?.validate();
  submitting.value = true;
  try {
    if (isEdit.value) {
      await updateProductApi(Number(route.params.id), form, auth.user.id);
      ElMessage.success('商品信息已保存');
    } else {
      await createProductApi(form, auth.user.id);
      ElMessage.success('商品已提交审核');
    }
    router.push('/user/products');
  } finally {
    submitting.value = false;
  }
}

onMounted(loadEditProduct);
</script>

<template>
  <section class="page-shell product-form-page">
    <PageHeader :title="isEdit ? '编辑商品' : '发布商品'" :subtitle="isEdit ? '更新后仍按当前状态展示，审核失败商品会重新进入待审核' : '提交后商品进入待审核，管理员通过后上架'">
      <el-button @click="router.back()">返回</el-button>
    </PageHeader>

    <div class="soft-card form-card" v-loading="loading">
      <el-alert
        v-if="auth.user?.status === 'disabled'"
        title="账号已被禁用，不能发布或编辑商品。"
        type="warning"
        show-icon
        :closable="false"
      />
      <el-form ref="formRef" :model="form" :rules="rules" label-width="110px" class="product-form" :disabled="auth.user?.status === 'disabled'">
        <el-form-item label="商品标题" prop="title">
          <el-input v-model="form.title" maxlength="50" show-word-limit placeholder="例如：iPad Air 5 64G 蓝色" />
        </el-form-item>
        <el-form-item label="商品分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="2" :step="10" />
        </el-form-item>
        <el-form-item label="商品成色" prop="condition">
          <el-select v-model="form.condition" placeholder="请选择成色">
            <el-option label="全新" value="全新" />
            <el-option label="九成新" value="九成新" />
            <el-option label="八成新" value="八成新" />
            <el-option label="七成新" value="七成新" />
            <el-option label="有明显使用痕迹" value="有明显使用痕迹" />
          </el-select>
        </el-form-item>
        <el-form-item label="交易地点" prop="location">
          <el-select v-model="form.location" filterable allow-create placeholder="请选择或输入地点">
            <el-option v-for="item in campusLocations" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="手机号 / 微信 / QQ" />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="6" maxlength="500" show-word-limit placeholder="说明购买时间、使用情况、配件、交易偏好等" />
        </el-form-item>
        <el-form-item label="商品图片" prop="images">
          <ImageUploader v-model="form.images" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="submitting" @click="submit">{{ isEdit ? '保存修改' : '提交审核' }}</el-button>
          <el-button size="large" @click="router.push('/user/products')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.product-form-page {
  padding-top: 4px;
}

.product-form {
  max-width: 760px;
}

.el-select {
  width: 100%;
}
</style>
