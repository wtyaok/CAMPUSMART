<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';

const model = defineModel<string>({ default: '' });

defineProps<{
  placeholder?: string;
}>();

const emit = defineEmits<{
  search: [];
}>();
</script>

<template>
  <el-input v-model="model" clearable :placeholder="placeholder || '搜索商品、教材、地点'" @keyup.enter="emit('search')">
    <template #prefix>
      <el-icon><Search /></el-icon>
    </template>
    <template #append>
      <el-button @click="emit('search')">搜索</el-button>
    </template>
  </el-input>
</template>
