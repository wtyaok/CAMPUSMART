import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getOptionsApi } from '@/api/user';

export const useOptionsStore = defineStore('options', () => {
  const categories = ref<string[]>([]);
  const campusLocations = ref<string[]>([]);

  async function fetchOptions() {
    const result = await getOptionsApi();
    categories.value = result.categories;
    campusLocations.value = result.campusLocations;
  }

  fetchOptions();

  return {
    categories,
    campusLocations,
    fetchOptions
  };
});
