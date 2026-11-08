<script setup>
defineProps({ students: { type: Array, default: () => [] }, canEdit: Boolean, deleting: Boolean })
defineEmits(['delete'])
</script>
<template>
  <div class="table-wrapper">
    <table class="students-table">
      <thead><tr><th scope="col">ФИО</th><th scope="col">Группа</th><th scope="col">Общежитие</th><th scope="col">Комната</th><th scope="col">Действия</th></tr></thead>
      <tbody>
        <tr v-for="student in students" :key="student.id">
          <td>{{ student.fullName }}</td><td>{{ student.groupName }}</td><td>{{ student.dormNumber }}</td><td>{{ student.room }}</td>
          <td><div class="table-actions">
            <RouterLink :to="`/students/${student.id}`" class="button button-secondary">Просмотр</RouterLink>
            <template v-if="canEdit">
              <RouterLink :to="`/students/${student.id}/edit`" class="button button-secondary">Изменить</RouterLink>
              <button type="button" :disabled="deleting" @click="$emit('delete', student)">Удалить</button>
            </template>
          </div></td>
        </tr>
        <tr v-if="!students.length"><td colspan="5">Студенты не найдены</td></tr>
      </tbody>
    </table>
  </div>
</template>
