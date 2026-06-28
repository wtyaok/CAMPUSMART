<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div class="page-header">
    <div>
      <h1>{{ title }}</h1>
      <p v-if="subtitle">{{ subtitle }}</p>
    </div>
    <div class="actions">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin: 22px 0 16px;

  h1 {
    margin: 0;
    font-size: 26px;
    line-height: 1.25;
  }

  p {
    margin: 7px 0 0;
    color: var(--cm-muted);
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
