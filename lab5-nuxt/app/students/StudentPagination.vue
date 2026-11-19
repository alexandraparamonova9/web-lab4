<script setup>
const props = defineProps({
  page: {
    type: Number,
    default: 0
  },
  totalPages: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:page'])

function previousPage() {
  if (props.page > 0) {
    emit('update:page', props.page - 1)
  }
}

function nextPage() {
  if (props.page < props.totalPages - 1) {
    emit('update:page', props.page + 1)
  }
}
</script>

<template>
  <nav v-if="totalPages > 0" aria-label="Страницы студентов">
    <button
        type="button"
        :disabled="page === 0"
        @click="previousPage"
    >
      Назад
    </button>

    <span>Страница {{ page + 1 }} из {{ totalPages }}</span>

    <button
        type="button"
        :disabled="page >= totalPages - 1"
        @click="nextPage"
    >
      Вперёд
    </button>
  </nav>
</template>