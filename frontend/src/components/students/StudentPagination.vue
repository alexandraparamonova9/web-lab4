<script setup>
const PAGE_SIZES = [5, 10, 20, 50]
defineProps({ page: Number, totalPages: Number, totalElements: Number, size: Number, loading: Boolean })
defineEmits(['page', 'size'])
</script>
<template>
  <nav class="pagination" aria-label="Страницы списка">
    <button class="button button-secondary" :disabled="loading || page === 0" @click="$emit('page', page - 1)">Назад</button>
    <span aria-live="polite">Страница {{ totalPages ? page + 1 : 0 }} из {{ totalPages }} · Всего: {{ totalElements }}</span>
    <button class="button button-secondary" :disabled="loading || page + 1 >= totalPages" @click="$emit('page', page + 1)">Далее</button>
    <label class="form-group">На странице
      <select :value="size" :disabled="loading" @change="$emit('size', Number($event.target.value))">
        <option v-for="value in PAGE_SIZES" :key="value" :value="value">
          {{ value }}
        </option>
      </select>
    </label>
  </nav>
</template>
