<script setup lang="ts">
import { Picture, Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const model = defineModel<string[]>({ required: true });

const samples = [
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=900&q=80'
];

function addSample() {
  if (model.value.length >= 5) {
    ElMessage.warning('最多上传 5 张图片');
    return;
  }
  model.value = [...model.value, samples[model.value.length % samples.length]];
}

function remove(index: number) {
  model.value = model.value.filter((_, idx) => idx !== index);
}
</script>

<template>
  <div class="uploader">
    <div v-for="(img, index) in model" :key="`${img}-${index}`" class="thumb">
      <img :src="img" alt="商品图片" />
      <el-button size="small" type="danger" text @click="remove(index)">移除</el-button>
    </div>
    <button v-if="model.length < 5" type="button" class="add" @click="addSample">
      <el-icon><Plus /></el-icon>
      <span>添加示例图片</span>
    </button>
    <div v-if="!model.length" class="hint">
      <el-icon><Picture /></el-icon>
      可添加 1-5 张商品图，演示环境使用示例图片。
    </div>
  </div>
</template>

<style scoped lang="scss">
.uploader {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.thumb,
.add {
  width: 126px;
  height: 126px;
  border-radius: 8px;
}

.thumb {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--cm-border);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .el-button {
    position: absolute;
    right: 6px;
    bottom: 6px;
    background: rgba(255, 255, 255, 0.92);
  }
}

.add {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--cm-primary);
  background: #eef5ff;
  border: 1px dashed #9ab7ef;
  cursor: pointer;
}

.hint {
  min-height: 126px;
  display: flex;
  align-items: center;
  color: var(--cm-muted);
  gap: 8px;
}
</style>
