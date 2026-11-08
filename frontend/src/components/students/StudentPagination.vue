<script setup>
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
        <option :value="10">10</option><option :value="20">20</option><option :value="50">50</option>
      </select>
    </label>
  </nav>
</template>
