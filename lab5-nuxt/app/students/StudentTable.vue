<script setup>
defineProps({
  students: {
    type: Array,
    default: () => []
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])
</script>

<template>
  <div>
    <p v-if="students.length === 0">
      Студенты не найдены
    </p>

    <table v-else>
      <thead>
      <tr>
        <th>ID</th>
        <th>ФИО</th>
        <th>Группа</th>
        <th>ИСУ</th>
        <th>Общежитие</th>
        <th>Комната</th>
        <th>Действия</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="student in students" :key="student.id">
        <td>{{ student.id }}</td>
        <td>{{ student.fullName }}</td>
        <td>{{ student.groupName }}</td>
        <td>{{ student.isuId }}</td>
        <td>{{ student.dormNumber }}</td>
        <td>{{ student.room }}</td>
        <td>
          <NuxtLink :to="`/students/${student.id}`">
            Подробнее
          </NuxtLink>

          <template v-if="isAdmin">
            <NuxtLink :to="`/students/${student.id}/edit`">
              Изменить
            </NuxtLink>

            <button type="button" @click="emit('delete', student.id)">
              Удалить
            </button>
          </template>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>