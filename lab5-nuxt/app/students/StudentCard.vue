<script setup>
defineProps({
  student: {
    type: Object,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <article>
    <h2>{{ student.fullName }}</h2>

    <p><strong>ID:</strong> {{ student.id }}</p>
    <p><strong>Группа:</strong> {{ student.groupName }}</p>
    <p><strong>ИСУ ID:</strong> {{ student.isuId }}</p>
    <p><strong>Общежитие:</strong> {{ student.dormNumber }}</p>
    <p><strong>Комната:</strong> {{ student.room }}</p>
    <p><strong>Дата заселения:</strong> {{ student.moveInDate }}</p>
    <p>
      <strong>Иностранный студент:</strong>
      {{ student.isForeigner ? 'Да' : 'Нет' }}
    </p>
    <p><strong>Заметки:</strong> {{ student.notes || 'Нет' }}</p>

    <NuxtLink to="/students">
      Назад к списку
    </NuxtLink>

    <template v-if="isAdmin">
      <NuxtLink :to="`/students/${student.id}/edit`">
        Редактировать
      </NuxtLink>

      <button type="button" @click="emit('delete', student.id)">
        Удалить
      </button>
    </template>
  </article>
</template>